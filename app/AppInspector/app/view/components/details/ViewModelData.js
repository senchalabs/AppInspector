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

    title: 'MVMM ViewModel',
    cls: 'treegrid highlight',
    itemId: 'viewmodeldata',

    // controller: 'viewmodeldata',
    viewModel: {
        type: 'viewmodeldata'
    },
    bind: {
        store: '{viewmodelDetails}'
    },

    config: {
        initialLoad: false
    },

    autoScroll: true,
    animate: false,
    allowDeselect: true,
    useArrows: true,
    lines: false,

    root: {
        text: '_VIEWMODEL_',
        expanded: true,
        value: '',
        cls: 'root',
        iconCls: 'no-icon',
        children: []
    },

    viewConfig: {
        markDirty: false,
        stripeRows: true
    },
    columns: [{
        xtype: 'treecolumn',
        dataIndex: 'text',
        text: 'Key',
        flex: 3
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'value',
        text: 'value',
        flex: 2
    }]
});
