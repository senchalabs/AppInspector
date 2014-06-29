/**
 * @class   AI.view.componets.details.BindingsModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.componets.details.BindingsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.bindings',

    requires: [
        'Ext.data.Field',
        'Ext.util.Sorter'
    ],

    stores: {
        bindingsstore: {
            storeId: 'bindingsDetails',
            fields: ['key', 'value', 'boundTo', {
                defaultValue: null,
                name: 'isValid',
                type: 'boolean',
                useNull: true
            }],
            sorters: 'key'
        }
    }
});
