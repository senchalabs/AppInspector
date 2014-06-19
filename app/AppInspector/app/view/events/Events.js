/**
 *
 */
Ext.define('AI.view.events.Events', {
    extend: 'Ext.grid.Panel',
    xtype: 'events',

    requires: [
        'Ext.util.DelayedTask',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.toolbar.Fill',
        'Ext.grid.column.Column',
        'Ext.grid.View',
        'Ext.selection.RowModel',
        'AI.view.field.Filter'
    ],

    controller: 'events',
    viewModel: {
        type: 'events'
    },

    bind: {
        store: '{events}'
    },

    iconCls: 'icn-events',
    title: 'Events',

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
                xtype: 'button',
                text: 'Clear',
                iconCls: 'icn-clear',
                reference: 'clear',
                handler: 'onClearEventsClick'
            }, {
                xtype: 'button',
                text: 'Record',
                iconCls: 'icn-record',
                reference: 'record',
                bind: {
                    hidden: '{recording}',
                    disabled: '{recording}'
                },
                handler: 'onRecordEventsClick'
            }, {
                xtype: 'button',
                text: 'Stop Recording',
                iconCls: 'icn-stop',
                cls: 'recording',
                reference: 'stop',
                bind: {
                    hidden: '{!recording}',
                    disabled: '{!recording}'
                },
                handler: 'onStopRecordingClick'
            },
            '->', {
                xtype: 'filterfield',
                itemId: 'FilterComponentsTree',
                listeners: {
                    change: 'onFilterChange',
                    applyfilter: 'onFilterEvents'
                }
            }
        ]
    }],

    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'eventName',
        text: 'Event Name'
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'source',
        text: 'Event Source',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'xtype',
        text: 'XType',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'cmpId',
        text: 'Cmp ID',
        flex: 1
    }],
    selModel: Ext.create('Ext.selection.RowModel', {
        mode: 'MULTI'
    }),

    listeners: {
        beforeadd: 'localize',
        scope: 'controller'
    }
});
