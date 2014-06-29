/**
 *
 */
Ext.define('AI.view.events.Events', {
    extend: 'Ext.grid.Panel',
    xtype: 'events',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.toolbar.Fill',
        'Ext.grid.View',
        'Ext.grid.column.Column',
        'Ext.selection.RowModel',
        'AI.view.field.Filter'
    ],

    controller: 'events',
    viewModel: {
        type: 'events'
    },

    bind: {
        store: '{Events}'
    },

    title: 'Events',
    glyph: 'xf0e7@fontawesome',

    viewConfig: {
        markDirty: false,
        stripeRows: true
    },
    columns: [
        {
            xtype: 'gridcolumn',
            dataIndex: 'eventName',
            text: 'Event Name'
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'source',
            text: 'Event Source',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'xtype',
            text: 'XType',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'cmpId',
            text: 'Cmp ID',
            flex: 1
        }
    ],
    selModel: Ext.create('Ext.selection.RowModel', {
        mode: 'MULTI'
    }),

    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'button',
                    text: 'Clear',
                    glyph: 'xf1b8@fontawesome',
                    reference: 'clear',
                    handler: 'onClearEventsClick'
                },
                {
                    xtype: 'button',
                    text: 'Record',
                    glyph: 'xf144@fontawesome',
                    reference: 'record',
                    bind: {
                        hidden: '{recording}',
                        disabled: '{recording}'
                    },
                    handler: 'onRecordEventsClick'
                },
                {
                    xtype: 'button',
                    text: 'Stop Recording',
                    glyph: 'xf04d@fontawesome',
                    cls: 'recording',
                    reference: 'stop',
                    bind: {
                        hidden: '{!recording}',
                        disabled: '{!recording}'
                    },
                    handler: 'onStopRecordingClick'
                },
                {
                    xtype: 'tbfill'
                },
                {
                    xtype: 'filterfield',
                    itemId: 'FilterComponentsTree',
                    listeners: {
                        change: 'onFilterChange',
                        applyfilter: 'onFilterEvents'
                    }
                }
            ]
        }
    ],

    listeners: {
        beforeadd: {
            fn: 'localize',
            single: true
        },
        scope: 'controller'
    }
});
