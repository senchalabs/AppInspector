/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 * Target editor.
 */
Ext.define('Siesta.Recorder.DragEditor', {
    extend : 'Ext.form.field.Picker',
    alias  : 'widget.drageditor',

    editable     : false,
    hideTrigger  : true,
    pickerOffset : [ 0, -20 ],

    listeners : {
        focus : function (fld, e, opts) {
            fld.expand();
        }
    },

    cancelEdit : function () {
        var me = this;
        me.fireEvent('blur');
        me.collapse();
    },

    applyValues : function () {
        var me = this,
            form = me.picker,
            vals = form.getForm().getValues(),
            rec = me.up('gridpanel').editing.activeRecord;

        var prot = Siesta.Recorder.RecordedEvent.prototype;
        var by = vals.by;

        vals.by = (by && prot.parseOffset(by)) || by;

        rec.set(vals);
        me.fireEvent('blur');
        me.collapse();
    },

    createPicker : function () {
        var me = this;
        var targetListeners = {
            select : this.onTargetChange,
            keyup  : this.onTargetChange,
            focus  : this.onTargetChange,
            buffer : 50,
            scope  : this
        };

        return new Ext.form.Panel({
            ownerCt     : this,
            renderTo    : document.body,
            floating    : true,
            bodyPadding : 5,
            title       : 'Edit drag action',
            items       : [
                new Siesta.Recorder.TargetEditor({
                    fieldLabel : 'Target:',
                    anchor     : '100%',
                    name       : 'actionTarget',
                    labelWidth : 60,
                    listeners  : targetListeners
                }),
                new Siesta.Recorder.TargetEditor({
                    fieldLabel : 'To:',
                    name       : 'to',
                    anchor     : '100%',
                    labelWidth : 60,

                    listeners  : targetListeners
                }),
                {
                    xtype      : 'textfield',
                    name       : 'by',
                    fieldLabel : 'By:',
                    labelWidth : 60,
                    width      : 200
                }
            ],
            listeners: {
                afterrender: function( panel, opts ) {
                    var rec = panel.up('gridpanel').editing.activeRecord;
                    panel.getForm().setValues(rec.data);
                }
            },
            buttons : [
                {
                    name    : 'cancel',
                    text    : 'Cancel',
                    handler : function (btn, e, opts) {
                        me.cancelEdit();
                    }
                },
                '->',
                {
                    name    : 'save',
                    text    : 'Save',
                    handler : function (btn, e, opts) {
                        me.applyValues();
                    }
                }
            ]
        });
    }

});
