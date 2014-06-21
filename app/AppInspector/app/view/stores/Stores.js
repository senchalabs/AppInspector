/**
 *
 */
Ext.define('AI.view.stores.Stores', {
    extend: 'Ext.panel.Panel',
    xtype: 'stores',

    requires: [
        'Ext.layout.container.VBox',
        'Ext.layout.container.HBox',
        'Ext.layout.container.Card',
        'AI.view.stores.StoresList',
        'AI.view.stores.details.RecordsList',
        'AI.view.stores.details.RecordsListTree',
        'AI.view.stores.details.RecordDetails'
    ],

    // controller: 'stores',
    // viewModel: {
    //     type: 'stores-stores'
    // },

    config: {
        initialLoad: false
    },

    title: 'Stores',
    glyph: 'xf1c0@fontawesome',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'storeslist',
        flex: 1
    }, {
        xtype: 'container',
        reference: 'storedetails',
        flex: 1,
        resizable: true,
        resizeHandles: 'n',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'container',
            reference: 'records',
            flex: 1,
            layout: 'card',
            activeItem: 0,
            items: [{
                xtype: 'recordslist',
                reference: 'recordslist'
            }, {
                xtype: 'recordslisttree',
                reference: 'recordslisttree'
            }]
        }, {
            xtype: 'recorddetails',
            reference: 'recorddetails',
            width: 300,
            resizable: true,
            resizeHandles: 'w'
        }]
    }]
});
