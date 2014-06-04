Ext.define('AI.view.MVC', {
    extend : 'Ext.container.Container',
    alias  : 'widget.mvc',

    requires : [
        'AI.view.mvc.Listeners',
        'AI.view.mvc.Records',
        'Ext.tree.Panel',
        'Ext.tree.View',
        'Ext.tree.Column',
        'Ext.grid.Panel'
    ],

    title   : 'MVC',
    iconCls : 'icn-mvc',

    layout : {
        type  : 'hbox',
        align : 'stretch'
    },

    items : [
        {
            xtype       : 'treepanel',
            flex        : 1,
            title       : 'Application Instance Details',
            store       : 'MVC',
            rootVisible : false,
            viewConfig  : {

            },
            columns     : [
                {
                    xtype     : 'treecolumn',
                    dataIndex : 'text',
                    text      : 'Class Name',
                    flex      : 1
                },
                {
                    xtype     : 'gridcolumn',
                    dataIndex : 'count',
                    text      : 'Count'
                }
            ]
        },
        {
            xtype  : 'mvc_listeners',
            hidden : true,
            flex   : 2
        },
        {
            xtype  : 'mvc_records',
            hidden : true,
            flex   : 2
        }
    ]

});