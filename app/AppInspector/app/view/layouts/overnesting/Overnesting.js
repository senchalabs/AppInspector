/**
 * @class   AI.view.layouts.overnesting.Overnesting
 * @extends Ext.grid.Panel
 */
Ext.define('AI.view.layouts.overnesting.Overnesting', {
    extend: 'Ext.grid.Panel',
    xtype : 'overnesting',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.toolbar.Fill',
        'Ext.grid.View',
        'Ext.grid.column.Column'
    ],

    config: {
        /**
         * @cfg {Boolean}   [initialLoad=false]
         */
        initialLoad: false
    },

    controller: 'overnesting',
    viewModel : {
        type: 'overnesting'
    },
    bind      : {
        store: '{Overnestings}'
    },

    title: 'Overnesting',

    viewConfig: {
        markDirty : false,
        stripeRows: true
    },
    columns   : [
        {
            xtype    : 'gridcolumn',
            dataIndex: 'cmpId',
            text     : 'Component ID',
            flex     : 1
        },
        {
            xtype    : 'gridcolumn',
            dataIndex: 'xtype',
            text     : 'XType',
            flex     : 1
        }
    ],

    dockedItems: [
        {
            xtype: 'toolbar',
            dock : 'top',
            items: [
                {
                    xtype    : 'button',
                    text     : 'Profile',
                    reference: 'profile',
                    glyph    : 'xf021@fontawesome',
                    handler  : 'onRefreshClick'
                },
                {
                    xtype    : 'button',
                    text     : 'Reveal',
                    tooltip  : 'Reveal in »Components« tab',
                    reference: 'revealcmp',
                    glyph    : 'xf0e8@fontawesome',
                    handler  : 'onRevealClick',
                    bind     : {
                        disabled: '{!selected}'
                    }
                },
                {
                    xtype: 'tbfill'
                },
                {
                    xtype    : 'button',
                    reference: 'help',
                    glyph    : 'xf128@fontawesome',
                    handler  : 'onHelpClick'
                }
            ]
        }
    ],

    listeners: {
        beforeadd: {
            fn    : 'localize',
            single: true
        },
        activate : {
            fn    : 'onActivate',
            single: true
        },
        select   : 'onSelect',
        scope    : 'controller'
    }
});
