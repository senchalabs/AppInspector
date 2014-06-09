/**
 * @class   AI.view.stores.Stores
 * @extends Ext.panel.Panel
 */
Ext.define('AI.view.stores.Stores', {
    extend : 'Ext.panel.Panel',
    alias  : 'widget.stores',

    requires : [
        'AI.view.FilterField',
        'AI.view.stores.RecordList',
        'AI.view.stores.RecordListTree',
        'AI.view.stores.RecordDetails',
        'Ext.grid.Panel',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.toolbar.Fill',
        'Ext.form.field.Text',
        'Ext.grid.column.Column',
        'Ext.grid.View',
        'Ext.tree.Panel',
        'Ext.grid.property.Grid'
    ],

    initialLoad : false,
    itemId      : 'StoreInspector',
    iconCls     : 'icn-stores',
    title       : 'Stores',

    layout : {
        type  : 'vbox',
        align : 'stretch'
    },

    initComponent : function () {
        var me = this;

        Ext.applyIf(me, {
            items     : [
                {
                    xtype       : 'gridpanel',
                    flex        : 1,
                    height      : 300,
                    itemId      : 'StoreList',
                    store       : 'stores.Stores',
                    dockedItems : [
                        {
                            xtype : 'toolbar',
                            dock  : 'top',
                            items : [
                                {
                                    xtype   : 'button',
                                    itemId  : 'RefreshStores',
                                    iconCls : 'icn-refresh',
                                    text    : 'Refresh'
                                },
                                {
                                    xtype : 'tbfill'
                                },
                                {
                                    xtype  : 'filterfield',
                                    itemId : 'FilterStoresList'
                                }
                            ]
                        }
                    ],
                    columns     : [
                        {
                            xtype     : 'gridcolumn',
                            dataIndex : 'id',
                            text      : 'Store ID',
                            flex      : 3
                        },
                        {
                            xtype     : 'gridcolumn',
                            dataIndex : 'count',
                            text      : 'Record Count',
                            flex      : 1
                        }
                    ],
                    viewConfig  : {
                        markDirty : false
                    }
                },
                {
                    xtype         : 'container',
                    flex          : 1,
                    itemId        : 'StoreDetails',
                    resizable     : true,
                    resizeHandles : 'n',
                    layout        : {
                        type  : 'hbox',
                        align : 'stretch'
                    },
                    items         : [
                        {
                            xtype  : 'container',
                            flex   : 1,
                            itemId : 'StoreRecordsContainer',
                            layout : 'card',
                            items  : [
                                {
                                    xtype  : 'recordliststore',
                                    itemId : 'RecordListStore'
                                },
                                {
                                    xtype  : 'recordlisttreestore',
                                    itemId : 'RecordListTreeStore'
                                }
                            ]
                        },
                        {
                            xtype         : 'recorddetails',
                            itemId        : 'RecordDetail',
                            width         : 300,
                            resizable     : true,
                            resizeHandles : 'w'
                        }
                    ]
                }
            ],
            listeners : {
                beforeadd : {
                    fn    : me.onStoreInspectorBeforeAdd,
                    scope : me
                }
            }
        });

        me.callParent(arguments);
    },

    onStoreInspectorBeforeAdd : function (container, component, index, eOpts) {
        this.setTitle(AI.util.i18n.getMessage(this.title));

    }

});
