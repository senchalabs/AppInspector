/**
 * @class   AI.view.mvc.tree.Tree
 * @extends Ext.tree.Panel
 */
Ext.define('AI.view.mvc.tree.Tree', {
    extend: 'Ext.tree.Panel',
    xtype : 'mvctree',

    requires: [
        'Ext.tree.View',
        'Ext.tree.Column',
        'Ext.grid.column.Column'
    ],

    controller: 'mvctree',
//    viewModel: {
//        type: 'mvctree'
//    },

    config: {
        initialLoad: false
    },

    autoScroll: true,
    animate   : true,

    viewConfig: {
        markDirty : false,
        stripeRows: true
    },
    columns   : [
        {
            xtype    : 'treecolumn',
            dataIndex: 'text',
            text     : 'Class Name',
            flex     : 1
        },
        {
            xtype    : 'gridcolumn',
            dataIndex: 'count',
            text     : 'Count'
        }
    ],

    listeners: {
        activate: {
            fn    : 'onActivate',
            single: true
        },
        select  : 'onSelect',
        scope   : 'controller'
    }
});
