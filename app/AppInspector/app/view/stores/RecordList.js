/**
 * @class   AI.view.stores.RecordList
 * @extends Ext.grid.Panel
 */
Ext.define('AI.view.stores.RecordList', {
    extend : 'Ext.grid.Panel',
    alias  : 'widget.recordliststore',

    requires : [
        'Ext.grid.column.Column',
        'Ext.grid.View',
        'Ext.toolbar.Paging'
    ],

    title       : 'Store Records',
    hideHeaders : true,
    store       : 'Records',

    initComponent : function () {
        var me = this;

        Ext.applyIf(me, {
            columns     : [
                {
                    xtype     : 'gridcolumn',
                    resizable : false,
                    dataIndex : 'id',
                    text      : 'Record ID',
                    flex      : 1
                }
            ],
            viewConfig  : {
                markDirty : false
            },
            dockedItems : [
                {
                    xtype       : 'pagingtoolbar',
                    dock        : 'bottom',
                    itemId      : 'mypagingtoolbar',
                    displayInfo : true,
                    store       : 'Records'
                }
            ]
        });

        me.callParent(arguments);
    }

});
