Ext.define('AI.view.profile.Overnesting', {
    extend : 'Ext.grid.Panel',
    xtype  : 'ai-view-profile-overnesting',

    requires : [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    title : 'Overnested Components',

    dockedItems : [
        {
            xtype : 'toolbar',
            dock  : 'top',
            items : [
                {
                    xtype  : 'button',
                    itemId : 'Profile',
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