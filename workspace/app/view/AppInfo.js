Ext.define('AI.view.AppInfo', {
    extend : 'Ext.grid.property.Grid',
    xtype  : 'ai-view-appinfo',

    title       : 'App Info',
    height      : 150,
    collapsed   : true,
    collapsible : true,
    itemId      : 'AppInfo',

    source : {
        'Version' : ''
    }

});