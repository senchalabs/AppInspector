/**
 * @class   AI.view.mvc.records.Records
 * @extends Ext.container.Container
 */
Ext.define('AI.view.mvc.records.Records', {
    extend: 'Ext.container.Container',
    xtype : 'mvcrecords',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.View',
        'Ext.grid.column.Column',
        'Ext.toolbar.Paging',
        'Ext.grid.property.Grid'
    ],

    controller: 'mvcrecords',
    viewModel : {
        type: 'mvcrecords'
    },

    layout: {
        type : 'hbox',
        align: 'stretch'
    },

    items: [
        {
            xtype      : 'gridpanel',
            flex       : 1,
            bind       : {
                store: '{Records}'
            },
            viewConfig : {
                markDirty : false,
                stripeRows: true
            },
            columns    : [
                {
                    xtype    : 'gridcolumn',
                    resizable: false,
                    dataIndex: 'id',
                    text     : 'Record ID',
                    flex     : 1
                }
            ],
            dockedItems: [
                {
                    xtype      : 'pagingtoolbar',
                    dock       : 'bottom',
                    width      : 360,
                    displayInfo: true,
                    bind       : {
                        store: '{Records}'
                    }
                }
            ],
            listeners  : {
                select: 'onRecordSelect'
            }
        },
        {
            xtype          : 'propertygrid',
            flex           : 1,
            nameColumnWidth: '50%',
            source         : {}
        }
    ]
});
