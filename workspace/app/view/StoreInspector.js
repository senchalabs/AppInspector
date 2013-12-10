Ext.define('AI.view.StoreInspector', {
    extend : 'Ext.container.Container',
    xtype  : 'ai-view-storeinspector',

    requires : [
        'Ext.grid.Panel'
    ],

    title : 'Stores',

    layout : 'border',

    items : [
        {
            region : 'center',
            xtype  : 'gridpanel',

            columns : [
                {
                    text      : 'Store ID',
                    dataIndex : 'id',
                    flex      : 1
                },
                {
                    text      : 'Count',
                    dataIndex : 'count',
                    width     : 100
                }
            ]
        }
    ]
});