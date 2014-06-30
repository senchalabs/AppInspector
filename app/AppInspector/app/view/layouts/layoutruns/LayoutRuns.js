/**
 *
 */
Ext.define('AI.view.layouts.layoutruns.LayoutRuns', {
    extend: 'Ext.tree.Panel',
    xtype: 'layoutruns',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.toolbar.Fill',
        'Ext.tree.View',
        'Ext.tree.Column',
        'Ext.grid.column.Column'
    ],

    controller: 'layoutruns',
    viewModel: {
        type: 'layoutruns'
    },
    bind: {
        store: '{LayoutRuns}'
    },

    title: 'Layout Runs',

    autoScroll: true,
    animate: true,

    viewConfig: {
        markDirty: false,
        stripeRows: true
    },
    columns: [{
        xtype: 'treecolumn',
        dataIndex: 'text',
        text: 'Component ID',
        flex: 2
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'xtype',
        text: 'XType',
        flex: 1
    }],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'button',
            text: 'Clear',
            glyph: 'xf1b8@fontawesome',
            reference: 'clear',
            handler: 'onClearLayoutsClick'
        }, {
            xtype: 'button',
            text: 'Record',
            glyph: 'xf144@fontawesome',
            reference: 'record',
            bind: {
                hidden: '{recording}',
                disabled: '{recording}'
            },
            handler: 'onRecordLayoutsClick'
        }, {
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
        }, {
            xtype: 'button',
            text: 'Reveal',
            tooltip: 'Reveal in »Components« tab',
            reference: 'revealcmp',
            glyph: 'xf0e8@fontawesome',
            handler: 'onRevealClick',
            bind: {
                disabled: '{!selected}'
            }
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'filterfield',
            itemId: 'FilterComponentsTree'
        }]
    }],

    listeners: {
        beforeadd: {
            fn: 'localize',
            single: true
        },
        select: 'onSelectLayoutRunComponent',
        scope: 'controller'
    }
});
