/**
 * @class   AI.view.field.Filter
 * @extends Ext.form.field.Text
 */
Ext.define('AI.view.field.Filter', {
    extend: 'Ext.form.field.Text',
    xtype : 'filterfield',

    controller: 'filterfield',

    config: {
        /**
         * @cfg {Boolean}   [forceEnter=true]
         * false to allow filter to be applied
         */
        forceEnter: true
    },

    maxWidth       : 200,
    minWidth       : 100,
    fieldLabel     : 'Filter',
    hideLabel      : true,
    name           : 'filter',
    tabIndex       : 1,
    emptyText      : 'Filter',
    enableKeyEvents: true,
    selectOnFocus  : true,
    triggers       : {
        clear: {
            cls    : 'fa clear-trigger',
            /**
             * @param   {AI.view.field.Filter}    field
             * @fires   applyfilter
             */
            handler: function (field) {
                field.reset();
                field.fireEvent('applyfilter', field, '');
            }
        }
    },

    listeners: {
        change      : 'onFilterfieldChange',
        keypress    : 'onFilterfieldKeypress',
        beforerender: 'onFilterfieldBeforeRender',
        scope       : 'controller'
    }
});
