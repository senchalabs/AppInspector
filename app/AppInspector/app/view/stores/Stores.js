/**
 * @class   AI.view.stores.Stores
 * @extends Ext.panel.Panel
 */
Ext.define('AI.view.stores.Stores', {
    extend: 'Ext.panel.Panel',
    xtype: 'stores',

    requires: [
        'Ext.layout.container.VBox',
        'Ext.layout.container.HBox',
        'Ext.layout.container.Card',
        'AI.view.stores.storeslist.StoresList',
        'AI.view.stores.recordslist.RecordsList',
        'AI.view.stores.recordslisttree.RecordsListTree',
        'AI.view.stores.recorddetails.RecordDetails'
    ],

    mixins: [
        'AI.mixin.Localize'
    ],

    config: {
        initialLoad: false
    },

    title: 'Stores',
    glyph: 'xf1c0@fontawesome',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'storeslist',
            flex: 1
        },
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'container',
                    itemId: 'records',
                    flex: 1,
                    layout: 'card',
                    activeItem: 0,
                    items: [
                        {
                            xtype: 'recordslist',
                            itemId: 'recordslist'
                        },
                        {
                            xtype: 'recordslisttree',
                            itemId: 'recordslisttree'
                        }
                    ]
                },
                {
                    xtype: 'recorddetails',
                    itemId: 'recorddetails',
                    flex: 1
                }
            ]
        }
    ],

    listeners: {
        beforeadd: {
            fn: 'localize',
            single: true
        },
        activate: {
            fn: 'onActivate',
            single: true
        },
        scope: 'this'
    },

    /**
     * delegate
     */
    onActivate: function () {
        var storeslist = this.down('storeslist');

        storeslist.fireEvent('activate', storeslist);
    }
});
