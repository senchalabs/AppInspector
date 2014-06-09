/**
 * @class   AI.view.stores.RecordDetails
 * @extends Ext.tree.Panel
 */
Ext.define('AI.view.stores.RecordDetails', {
    extend : 'Ext.tree.Panel',
    alias  : 'widget.recorddetails',

    requires : [
        'Ext.tree.View',
        'Ext.tree.Column'
    ],

    cls         : 'treegrid',
    title       : 'Record Details',
    columnLines : false,
    hideHeaders : true,
    rowLines    : true,
    store       : 'stores.RecordDetails',
    useArrows   : true,

    initComponent : function () {
        var me = this;

        Ext.applyIf(me, {
            viewConfig : {
                markDirty  : false,
                stripeRows : true
            },
            columns    : [
                {
                    xtype     : 'treecolumn',
                    dataIndex : 'text',
                    text      : 'Name',
                    flex      : 1
                },
                {
                    xtype     : 'gridcolumn',
                    renderer  : function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var v = value;

                        if (value === null) {
                            v = 'null';
                        }

                        if (record.data.text === 'undefined') {
                            v = 'undefined';
                        }

                        return '<span class="' + record.get('type') + ' ' + v + '">' + v + '</span>';
                    },
                    dataIndex : 'value',
                    text      : 'Value',
                    flex      : 2
                }
            ]
        });

        me.callParent(arguments);
    }

});
