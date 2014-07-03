/**
 * @class   AI.view.field.FilterController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.field.FilterController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.filterfield',

    /**
     * @param  {AI.view.field.Filter}   field
     * @param  {String}                 newValue
     *
     * @fires  applyfilter
     */
    onFilterfieldChange: function (field, newValue) {
        if (field.getForceEnter()) {
            return; // cancel
        }

        // <debug>
        console.log('onFilterfieldChange', newValue || '-empty-');
        // </debug>

        field.fireEvent('applyfilter', field, newValue);
    },

    /**
     * @param  {AI.view.field.Filter}   field
     * @param  {Ext.event.Event}        e
     *
     * @fires  applyfilter
     */
    onFilterfieldKeypress: function (field, e) {
        var value = field.getValue();

        if (field.getForceEnter() && e.getKey() === Ext.EventObject.ENTER) {
            // <debug>
            console.log('onFilterfieldKeypress', value || '-empty-');
            // </debug>

            field.fireEvent('applyfilter', field, value);
        }
    },

    /**
     * @param  {AI.view.field.Filter}   field
     * @param  {Object}                 [eOpts]
     */
    onFilterfieldBeforeRender: function (field, eOpts) {
        // TODO - figure out i18n
        // field.emptyText = AI.util.i18n.getMessage(field.emptyText);
    }
});
