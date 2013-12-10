Ext.define('AI.view.Main', {
    extend   : 'Ext.container.Container',
    requires : [
        'Ext.tab.Panel',
        'Ext.layout.container.Border',

        'AI.view.StoreInspector'
    ],

    xtype : 'app-main',

    layout : {
        type : 'border'
    },

    items : [
//        {
//            region : 'west',
//            xtype  : 'panel',
//            title  : 'west',
//            width  : 150
//        },
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