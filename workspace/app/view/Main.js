Ext.define('AI.view.Main', {
    extend   : 'Ext.container.Container',
    requires : [
        'Ext.tab.Panel',
        'Ext.layout.container.Border',

        'AI.view.StoreInspector',
        'AI.view.AppInfo'
    ],

    xtype : 'app-main',

    layout : {
        type : 'border'
    },

    items : [
        {
            region    : 'north',
            xtype     : 'ai-view-appinfo'
        },
        {
            region : 'center',
            xtype  : 'tabpanel',
            items  : [
                {
                    xtype : 'ai-view-storeinspector'
                }
            ]
        }
    ]
});