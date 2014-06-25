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

    mixins: [
        'AI.mixin.Localize'
    ],

    title: 'MVMM ViewModel',
    cls: 'treegrid highlight',
    itemId: 'viewmodeldata',

    // controller: 'viewmodeldata',
    viewModel: {
        type: 'viewmodeldata'
    },
    bind: {
        store: '{ViewModels}'
    },

    config: {
        initialLoad: false
    },

    autoScroll: true,
    animate: true,

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
