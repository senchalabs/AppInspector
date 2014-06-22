/**
 *
 */
Ext.define('AI.view.stores.StoresListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.storeslist',

    requires: [
        'Ext.util.Sorter',
        'Ext.data.Field',
        'Ext.data.proxy.Memory'
    ],

    stores: {
        storesList: {
            storeId: 'storesList',
            fields: ['id', 'count', 'model', {
                name: 'isTree',
                type: 'boolean',
                defaultValue: false
            }, {
                name: 'leaf',
                type: 'boolean',
                defaultValue: false
            }],
            sorters: 'id',
            proxy: {
                type: 'memory'
            }
        }
    }
});
