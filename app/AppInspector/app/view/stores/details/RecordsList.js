/**
 *
 */
Ext.define('AI.view.stores.details.RecordsList', {
    extend: 'Ext.grid.Panel',
    xtype: 'recordslist',

    requires: [
        'Ext.grid.View',
        'Ext.grid.column.Column',
        'Ext.toolbar.Paging'
    ],

    controller: 'recordslist',
    viewModel: {
        type: 'recordslist'
    },

    bind: {
        store: '{Records}'
    },

    title: 'Store Records',
    hideHeaders: true,

    viewConfig: {
        markDirty: false
    },
    columns: [{
        xtype: 'gridcolumn',
        resizable: false,
        dataIndex: 'id',
        text: 'Record ID',
        flex: 1
    }],

    dockedItems: [{
        xtype: 'pagingtoolbar',
        dock: 'bottom',
        reference: 'recordslistpagingtoolbar',
        displayInfo: true,
        bind: {
            store: '{recordlist}'
        }
    }],

    listeners: {
        loadrecords: 'loadStoreRecords',
        select: 'onSelect',
        scope: 'controller'
    }
});
