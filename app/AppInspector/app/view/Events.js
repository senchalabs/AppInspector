/**
 * @class   AI.view.Events
 * @extends Ext.grid.Panel
 */
Ext.define('AI.view.Events', {
    extend : 'Ext.grid.Panel',
    alias  : 'widget.eventgrid',

    requires : [
        'AI.view.FilterField',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.toolbar.Fill',
        'Ext.form.field.Text',
        'Ext.grid.column.Column',
        'Ext.grid.View',
        'Ext.selection.RowModel'
    ],

    itemId  : 'EventInspector',
    iconCls : 'icn-events',
    title   : 'Events',
    store   : 'Events',

    initComponent : function () {
        var me = this;

        Ext.applyIf(me, {
            dockedItems : [
                {
                    xtype : 'toolbar',
                    dock  : 'top',
                    items : [
                        {
                            xtype   : 'button',
                            itemId  : 'ClearEvents',
                            iconCls : 'icn-clear',
                            text    : 'Clear'
                        },
                        {
                            xtype   : 'button',
                            itemId  : 'RecordEvents',
                            iconCls : 'icn-record',
                            text    : 'Record'
                        },
                        {
                            xtype   : 'button',
                            hidden  : true,
                            itemId  : 'StopRecording',
                            iconCls : 'icn-stop',
                            text    : 'Stop Recording'
                        },
                        {
                            xtype : 'tbfill'
                        },
                        {
                            xtype  : 'filterfield',
                            itemId : 'FilterEventsList'
                        }
                    ]
                }
            ],
            columns     : [
                {
                    xtype     : 'gridcolumn',
                    dataIndex : 'eventName',
                    text      : 'Event Name'
                },
                {
                    xtype     : 'gridcolumn',
                    dataIndex : 'source',
                    text      : 'Event Source',
                    flex      : 1
                },
                {
                    xtype     : 'gridcolumn',
                    dataIndex : 'xtype',
                    text      : 'XType',
                    flex      : 1
                },
                {
                    xtype     : 'gridcolumn',
                    dataIndex : 'cmpId',
                    text      : 'Cmp ID',
                    flex      : 1
                }
            ],
            listeners   : {
                beforeadd : {
                    fn    : me.onEventInspectorBeforeAdd,
                    scope : me
                }
            },
            selModel    : Ext.create('Ext.selection.RowModel', {
                mode : 'MULTI'
            })
        });

        me.callParent(arguments);
    },

    onEventInspectorBeforeAdd : function (container, component, index, eOpts) {
        this.setTitle(AI.util.i18n.getMessage(this.title));

    }

});
