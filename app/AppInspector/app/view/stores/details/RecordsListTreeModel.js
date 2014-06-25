/**
 *
 */
Ext.define('AI.view.stores.details.RecordsListTreeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.recordslisttree',

    requires: [
        'Ext.data.Field',
        'Ext.data.proxy.Memory',
        'Ext.util.Sorter'
    ],

    stores: {
        TreeRecords: {
            type: 'tree',
            storeId: 'TreeRecords',
            fields: ['id', 'text'],
            rootVisible: true,
            root: {
                expanded: true,
                children: []
            },
            proxy: {
                type: 'memory'
            }
        }
    }
});
