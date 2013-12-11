Ext.define('AI.view.profile.BoxLayouts', {
    extend : 'Ext.grid.Panel',
    xtype  : 'ai-view-profile-boxlayouts',

    requires : [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    title : 'Overnested Box Layouts',

    dockedItems : [
        {
            xtype : 'toolbar',
            dock  : 'top',
            items : [
                {
                    xtype  : 'button',
                    itemId : 'ProfileBoxLayouts',
                    text   : 'Profile'
                }
            ]
        }
    ],

    columns : [
        {
            text      : 'Component ID',
            dataIndex : 'id',
            flex      : 1
        },
        {
            text      : 'XType',
            dataIndex : 'xtype',
            width     : 200
        }
    ]
});