Ext.define('AI.view.store.List', {
    extend : 'Ext.container.Container',
    xtype  : 'ai-view-store-list',

    requires : [
        'Ext.grid.Panel',
        'AI.view.store.Records'
    ],

    title : 'Stores',

    layout : 'border',

    items : [
        {
            region : 'center',
            xtype  : 'gridpanel',
            itemId : 'StoreList',

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
        },
        {
            xtype  : 'ai-view-store-records',
            region : 'south',
            height : 300,

            collapsed   : false,
            collapsible : true,
            resizable   : true
        }
    ]
});