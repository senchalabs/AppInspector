Ext.define('AI.view.component.Panel', {
    extend : 'Ext.container.Container',
    xtype  : 'ai-view-component-panel',

    requires : [
        'AI.view.component.Tree'
    ],

    layout : 'border',

    title : 'Components',

    items : [
        {
            xtype  : 'ai-view-component-tree',
            region : 'center'
        }
    ]
});