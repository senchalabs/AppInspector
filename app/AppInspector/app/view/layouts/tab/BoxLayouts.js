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
        'Ext.grid.View',
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

    viewConfig: {
        markDirty: false,
        stripeRows: true
    },
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
            glyph: 'xf021@fontawesome',
            handler: 'onRefreshClick'
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
            xtype: 'button',
            reference: 'help',
            glyph: 'xf128@fontawesome',
            handler: 'onHelpClick'
        }]
    }],

    listeners: {
        activate: 'onActivate',
        select: 'onSelect',
        beforeadd: {
            fn: 'localize',
            single: true
        },
        scope: 'controller'
    }
});
