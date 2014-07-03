/**
 * @class   AI.view.stores.storeslist.StoresListModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.stores.storeslist.StoresListModel', {
    extend: 'Ext.app.ViewModel',
    alias : 'viewmodel.storeslist',

    requires: [
        'Ext.util.Sorter',
        'Ext.data.Field',
        'Ext.data.proxy.Memory'
    ],

    stores: {
        Stores: {
            storeId: 'Stores',
            fields : ['id', 'count', 'model', {
                name        : 'isTree',
                type        : 'boolean',
                defaultValue: false
            }, {
                name        : 'leaf',
                type        : 'boolean',
                defaultValue: false
            }],
            sorters: 'id',
            proxy  : {
                type: 'memory'
            }
        }
    }
});
