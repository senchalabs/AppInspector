/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 * Target column editor.
 */
Ext.define('Siesta.Recorder.TargetColumn', {
    extend       : 'Ext.grid.Column',
    alias        : 'widget.targetcolumn',
    header       : 'Target / Value',
    dataIndex    : 'actionTarget',
    flex         : 1,
    sortable     : false,
    menuDisabled : true,
    field        : {},
    tdCls        : 'eventview-targetcolumn',

    // API for highlighting typed target text, supplied by owner/creator
    highlightTarget : null,
    resolveTarget   : null,

    renderer : function (v, m, r) {
        if (r.data.type === 'drag') {
            var retVal = v;

            if (r.data.by) {
                retVal += ' by: [' + r.data.by.toString() + ']';
            } else if (r.data.to) {
                retVal += ' to: ' + r.data.to;
            }

            return retVal;
        }

        return v;
    },

    // HACK, some dirt since Ext JS doesn't allow to re-bind a new editor to a column
    bindEditor : function (editor, actionRecord) {
        editor.alignment = 'tl-c?';

        var newField = this.getTargetEditor(actionRecord);

        // Not all actions have target editors
        if (!newField) {
            return false;
        }

        var oldField = editor.field;

        this.setEditor(newField);

        editor.removeAll(true);
        editor.add(newField);
        editor.field = newField;

        Ext.apply(newField, {
            inEditor  : true,
            msgTarget : newField.msgTarget == 'title' ? 'title' : 'qtip'
        });

        editor.mun(oldField, {
            scope      : editor,
            blur       : editor.onFieldBlur,
            specialkey : editor.onSpecialKey
        });

        editor.mon(newField, {
            scope      : editor,
            blur       : editor.onFieldBlur,
            specialkey : editor.onSpecialKey
        });

        editor.mun(oldField, 'autosize', editor.onFieldAutosize, editor, { delay : 1 });

        if (newField.grow) {
            editor.mon(newField, 'autosize', editor.onFieldAutosize, editor, { delay : 1 });
        }
    },

    getTargetEditor : function (record) {
        var me = this;
        var type = record.get('type');

        if (type.match('waitFor')) {
            if (type === 'waitForAnimations') return null;
            if (type === 'waitForFn') return new Siesta.Recorder.CodeEditor();
            if (type === 'waitForMs') return new Ext.form.field.Number();

            // Default waitFor editor will just be a text field
            return new Ext.form.field.Text();
        }

        if (type === 'drag') {
            return new Siesta.Recorder.DragEditor({
                onTargetChange : function () {
                    me.onTargetChange.apply(me, arguments);
                }
            });
        }

        if (type === 'fn') {
            return new Siesta.Recorder.CodeEditor();
        }

        // Assume it's a target action
        var editor = new Siesta.Recorder.TargetEditor({
            listeners : {
                select : this.onTargetChange,
                keyup  : this.onTargetChange,
                focus  : this.onTargetChange,
                buffer : 50,
                scope  : this
            }
        });
        editor.populate(record);

        return editor;
    },

    onTargetChange : function (field) {
        var val = field.getValue();

        if (!val || val.length < 3) {
            return;
        }

        var result = this.highlightTarget(val);

        if (result.success) {
            field.clearInvalid()
        } else {
            field.markInvalid(result.message);
        }
    }
});
