/**
 *
 */
Ext.define('AI.view.stores.recordslisttree.RecordsListTreeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.recordslisttree',

    requires: [
        'Ext.data.Field',
        'Ext.util.Sorter'
    ],

    stores: {
        TreeRecords: {
            type: 'tree',
            storeId: 'TreeRecords',
            fields: ['id', 'text'],
            proxy: {
                type: 'memory'
            },
            rootVisible: false,
            root: {
                text: '_TREERECORDS_',
                expanded: true,
                children: []
            },
            sorters: 'text'
        }
    }
});
