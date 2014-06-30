/**
 *
 */
Ext.define('AI.view.layouts.tab.LayoutRuns', {
    extend: 'Ext.tree.Panel',
    xtype: 'layoutruns',

    controller: 'layoutruns',
    viewModel: {
        type: 'layoutruns'
    },
    bind: {
        store: '{layoutruns}'
    },

    title: 'Layout Runs',

    autoScroll: true,
    animate: false,
    rootVisible: false,
    allowDeselect: true,

    viewConfig: {},
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
                iconCls: 'icn-clear',
                reference: 'clear',
                handler: 'onClearLayoutsClick'
            }, {
                xtype: 'button',
                text: 'Record',
                iconCls: 'icn-record',
                reference: 'record',
                bind: {
                    hidden: '{recording}',
                    disabled: '{recording}'
                },
                handler: 'onRecordLayoutsClick'
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
            }, {
                xtype: 'button',
                text: 'Reveal',
                tooltip: 'Reveal in »Components« tab',
                reference: 'revealcmp',
                iconCls: 'icn-components',
                iconAlign: 'right',
                handler: 'onRevealClick',
                bind: {
                    disabled: '{!selected}'
                }
            },
            '->', {
                xtype: 'filterfield',
                itemId: 'FilterComponentsTree'
            }
        ]
    }],

    listeners: {
        beforeadd: 'localize',
        select: 'onSelectLayoutRunComponent',
        scope: 'controller'
    }
});
