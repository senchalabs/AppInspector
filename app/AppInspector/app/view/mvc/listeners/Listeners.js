/**
 *
 */
Ext.define('AI.view.mvc.listeners.Listeners', {
    extend: 'Ext.grid.Panel',
    xtype : 'mvclisteners',

    requires : [
        'Ext.grid.column.Column',
        'Ext.grid.View',
        'Ext.grid.feature.Grouping'
    ],

//    controller: 'mvclisteners',
    viewModel: {
        type: 'mvclisteners'
    },
    bind     : {
        store: '{Listeners}'
    },

    title: 'Controller Listeners',
    cls  : 'highlight',

    viewConfig: {
        markDirty : false,
        stripeRows: true
    },
    columns   : [
        {
            xtype    : 'gridcolumn',
            dataIndex: 'event',
            text     : 'Event Name',
            flex     : 1
        },
        {
            xtype    : 'gridcolumn',
            dataIndex: 'selector',
            text     : 'Selector',
            flex     : 1
        },
        {
            xtype        : 'gridcolumn',
            dataIndex    : 'method',
            text         : 'Method Name',
            emptyCellText: '<span class="highlight">anonymous function</span>',
            flex         : 1
        }
    ],

    features: [
        {
            ftype: 'grouping',
            enableGroupingMenu: false,
            enableNoGroups: false
        }
    ]
});
