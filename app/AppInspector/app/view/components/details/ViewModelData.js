/**
 *
 */
Ext.define('AI.view.components.details.ViewModelData', {
    extend: 'Ext.tree.Panel',
    xtype: 'viewmodeldata',

    requires: [
        'Ext.tree.View',
        'Ext.tree.Column',
        'Ext.grid.column.Column'
    ],

    title: 'ViewModel Data',
    cls: 'highlight',
    itemId: 'viewmodeldata',

    // controller: 'viewmodeldata',
    viewModel: {
        type: 'details'
    },
    bind: {
        store: '{viewmodelDetails}'
    },

    config: {
        initialLoad: false
    },

    autoScroll: true,
    animate: false,
    // rootVisible: false,
    allowDeselect: true,
    useArrows: true,

    viewConfig: {},
    columns: [{
        xtype: 'treecolumn',
        dataIndex: 'text',
        text: 'Key',
        flex: 2
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'value',
        text: 'value',
        flex: 1
    }],

    dockedItems: []
});
