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
    iconCls: 'icn-globe',

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
