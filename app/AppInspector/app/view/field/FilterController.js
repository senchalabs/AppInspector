/**
 *
 */
Ext.define('AI.view.field.FilterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.filterfield',

    /**
     * @param  {AI.view.field.Filter}   field
     * @param  {String}                 newValue
     * @param  {String}                 oldValue
     * @param  {Object}                 eOpts
     *
     * @fires  applyfilter
     */
    onFilterfieldChange: function(field, newValue, oldValue, eOpts) {
        if (field.getForceEnter()) {
            return; // cancel
        }

        // <debug>
        console.log('onFilterfieldChange', newValue);
        // </debug>

        field.fireEvent('applyfilter', field, newValue);
    },

    /**
     * @param  {AI.view.field.Filter}   field
     * @param  {Ext.event.Event}        e
     * @param  {Object}                 eOpts
     *
     * @fires  applyfilter
     */
    onFilterfieldKeypress: function(field, e, eOpts) {
        if (field.getForceEnter() && e.getKey() === Ext.EventObject.ENTER) {
            // <debug>
            console.log('onFilterfieldKeypress', field.getValue() || '-empty-');
            // </debug>

            field.fireEvent('applyfilter', field, field.getValue());
        }
    },

    /**
     * @param  {AI.view.field.Filter}   field
     * @param  {Object}                 eOpts
     */
    onFilterfieldBeforeRender: function(field, eOpts) {
        // TODO - figure out i18n
        // field.emptyText = AI.util.i18n.getMessage(field.emptyText);
    }
});
