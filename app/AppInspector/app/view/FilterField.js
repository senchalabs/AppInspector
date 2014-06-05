/**
 * @class   AI.view.FilterField
 * @extends Ext.form.field.Text
 */
Ext.define('AI.view.FilterField', {
    extend : 'Ext.form.field.Text',
    alias  : 'widget.filterfield',

    forceEnter      : true,
    maxWidth        : 200,
    minWidth        : 100,
    fieldLabel      : 'Filter',
    hideLabel       : true,
    name            : 'filter',
    tabIndex        : 1,
    emptyText       : 'Filter',
    enableKeyEvents : true,
    selectOnFocus   : true,

    initComponent : function () {
        var me = this;

        Ext.applyIf(me, {
            listeners : {
                change       : {
                    fn    : me.onTextfieldChange,
                    scope : me
                },
                keypress     : {
                    fn    : me.onTextfieldKeypress,
                    scope : me
                },
                beforerender : {
                    fn    : me.onTextfieldBeforeRender,
                    scope : me
                }
            }
        });

        me.callParent(arguments);
    },

    onTextfieldChange : function (field, newValue, oldValue, eOpts) {
        if (this.forceEnter === true) {
            return;
        }

        this.fireEvent('applyfilter', field, newValue);
    },

    onTextfieldKeypress : function (textfield, e, eOpts) {
        if (this.forceEnter === true && e.getKey() === Ext.EventObject.ENTER) {
            this.fireEvent('applyfilter', textfield, textfield.getValue());
        }
    },

    onTextfieldBeforeRender : function (component, eOpts) {
        this.emptyText = AI.util.i18n.getMessage(this.emptyText);

    }

});
