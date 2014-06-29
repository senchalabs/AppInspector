/**
 *
 */
Ext.define('AI.view.layouts.tab.BoxLayouts', {
    extend: 'Ext.grid.Panel',
    xtype: 'boxlayouts',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.toolbar.Fill',
        'Ext.grid.column.Column'
    ],

    config: {
        initialLoad: false
    },

    controller: 'boxlayouts',
    viewModel: {
        type: 'boxlayouts'
    },
    bind: {
        store: '{boxlayouts}'
    },

    title: 'Box Layouts',

    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'cmpId',
        text: 'Component ID',
        flex: 1
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
                text: 'Profile',
                reference: 'profile',
                iconCls: 'icn-refresh',
                handler: 'onRefreshClick'
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
                xtype: 'button',
                reference: 'help',
                text: '?',
                handler: 'onHelpClick'
            }
        ]
    }],

    listeners: {
        activate: 'onActivate',
        select: 'onSelect',
        beforeadd: 'localize',
        scope: 'controller'
    }
});
