Ext.define('AI.view.store.Records', {
    extend : 'Ext.container.Container',
    xtype  : 'ai-view-store-records',

    requires : [
        'Ext.grid.Panel',
        'Ext.grid.property.Grid'
    ],

    title : 'Records',

    layout : 'border',

    items : [
        {
            region : 'center',
            xtype  : 'gridpanel',
            itemId : 'RecordList',

            columns : [
                {
                    text      : 'Record ID',
                    dataIndex : 'id',
                    flex      : 1
                }
            ]
        },

        {
            region : 'east',
            xtype  : 'propertygrid',
            itemId : 'RecordDetail',
            width  : 200,

            collapsed   : false,
            collapsible : true,
            resizable   : true,

            source : {}
        }
    ]
});