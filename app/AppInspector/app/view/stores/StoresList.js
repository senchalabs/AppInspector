/**
 *
 */
Ext.define('AI.view.stores.StoresList', {
    extend: 'Ext.grid.Panel',
    xtype: 'storeslist',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.toolbar.Fill',
        'Ext.grid.View',
        'Ext.grid.column.Column',
        'AI.view.field.Filter'
    ],

    config: {
        initialLoad: false
    },

    controller: 'storeslist',
    viewModel: {
        type: 'storeslist'
    },

    bind: {
        store: '{Stores}'
    },

    viewConfig: {
        markDirty: false,
        stripeRows: true
    },
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'id',
        text: 'Store ID',
        flex: 3
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'count',
        text: 'Record Count',
        flex: 1
    }],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'button',
            text: 'Refresh',
            glyph: 'xf021@fontawesome',
            handler: 'onRefreshClick'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'filterfield',
            listeners: {
                // applyfilter: 'onApplyFilter'
            }
        }]
    }],

    listeners: {
        activate: {
            fn: 'onActivate',
            single: true
        },
        select: 'onSelect',
        scope: 'controller'
    }
});
