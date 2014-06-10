Ext.define('AI.view.components.ComponentViewModels', {
    extend : 'Ext.tree.Panel',
    xtype  : 'ai-components-viewmodels',

    requires : [
        'Ext.tree.Column'
    ],

    autoScroll  : true,
    disabled    : true,
    store       : 'components.ViewModelData',
    animate     : false,
    rootVisible : false,
    useArrows   : true,
    title       : 'ViewModel Data',

    columns     : [
        {
            xtype     : 'treecolumn',
            dataIndex : 'text',
            text      : 'Key',
            flex      : 2
        },
        {
            xtype     : 'gridcolumn',
            dataIndex : 'value',
            text      : 'value',
            flex      : 1
        }
    ]

});