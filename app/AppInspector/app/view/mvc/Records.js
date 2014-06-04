Ext.define('AI.view.mvc.Records', {
    extend : 'Ext.container.Container',
    alias  : 'widget.mvc_records',

    requires : [
        'Ext.grid.column.Column',
        'Ext.grid.View',
        'Ext.toolbar.Paging',
        'Ext.grid.property.Grid'
    ],

    title         : 'Store Records',
    resizable     : true,
    resizeHandles : 'n',

    layout : {
        type  : 'hbox',
        align : 'stretch'
    },

    items : [
        {
            xtype       : 'gridpanel',
            flex        : 1,
            title       : 'Store Records',
            store       : 'Records',
            columns     : [
                {
                    xtype     : 'gridcolumn',
                    resizable : false,
                    dataIndex : 'id',
                    text      : 'Record ID',
                    flex      : 1
                }
            ],
            dockedItems : [
                {
                    xtype       : 'pagingtoolbar',
                    dock        : 'bottom',
                    itemId      : 'mypagingtoolbar',
                    width       : 360,
                    displayInfo : true,
                    store       : 'Records'
                }
            ]
        },
        {
            xtype           : 'propertygrid',
            flex            : 1,
            resizable       : true,
            resizeHandles   : 'w',
            title           : 'Record Details',
            nameColumnWidth : '50%',
            source          : {

            }
        }
    ]

});