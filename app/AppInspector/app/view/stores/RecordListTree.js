Ext.define('AI.view.stores.RecordListTree', {
    extend : 'Ext.tree.Panel',
    alias  : 'widget.recordlisttreestore',

    requires : [
        'Ext.tree.View',
        'Ext.tree.Column'
    ],

    cls         : 'treegrid',
    title       : 'Store Records',
    hideHeaders : true,
    rowLines    : true,
    store       : 'stores.RecordsTree',

    initComponent : function () {
        var me = this;

        Ext.applyIf(me, {
            viewConfig : {
                stripeRows  : true,
                rootVisible : false
            },
            columns    : [
                {
                    xtype         : 'treecolumn',
                    dataIndex     : 'text',
                    emptyCellText : 'node text missing ...',
                    text          : 'Text',
                    flex          : 3
                },
                {
                    xtype     : 'gridcolumn',
                    hidden    : true,
                    dataIndex : 'id',
                    text      : 'ID',
                    flex      : 1
                }
            ]
        });

        me.callParent(arguments);
    }

});