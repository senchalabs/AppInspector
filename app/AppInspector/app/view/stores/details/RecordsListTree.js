/**
 *
 */
Ext.define('AI.view.stores.details.RecordsListTree', {
    extend: 'Ext.tree.Panel',
    xtype: 'recordslisttree',

    requires: [
        'Ext.tree.View',
        'Ext.tree.Column',
        'Ext.grid.column.Column'
    ],

    controller: 'recordslisttree',
    // viewModel: {
    //     type: 'recordslisttree'
    // },
    // bind: {
    //     store: '{TreeRecords}'
    // },

    title: 'Store Records (Tree)',
    hideHeaders: true,
    autoScroll: true,
    animate: true,

    viewConfig: {
        markDirty: false,
        stripeRows: true
    },
    columns: [{
        xtype: 'treecolumn',
        dataIndex: 'text',
        emptyCellText: 'node text missing...',
        text: 'Text',
        flex: 3
    }, {
        xtype: 'gridcolumn',
        hidden: true,
        dataIndex: 'id',
        text: 'Record ID',
        flex: 1
    }],

    listeners: {
        loadtreerecords: 'loadTreeStoreRecords',
        select: 'onSelect',
        scope: 'controller'
    }
});
