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

    // controller: 'recordslisttree',
    // viewModel: {
    //     type: 'recordslisttree'
    // },

    title: 'Store Records (Tree)',
    hideHeaders: true,
    rowLines: true,

    viewConfig: {
        stripeRows: true,
        rootVisible: false
    },
    columns: [{
        xtype: 'treecolumn',
        dataIndex: 'text',
        emptyCellText: 'node text missing ...',
        text: 'Text',
        flex: 3
    }, {
        xtype: 'gridcolumn',
        hidden: true,
        dataIndex: 'id',
        text: 'ID',
        flex: 1
    }]
});
