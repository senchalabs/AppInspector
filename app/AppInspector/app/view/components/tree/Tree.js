/**
 * @class   AI.view.components.tree.Tree
 * @extends Ext.tree.Panel
 */
Ext.define('AI.view.components.tree.Tree', {
    extend: 'Ext.tree.Panel',
    xtype: 'componentstree',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.toolbar.Fill',
        'Ext.tree.View',
        'Ext.tree.Column',
        'AI.view.field.Filter'
    ],

    controller: 'componentstree',
    viewModel: {
        type: 'componentstree'
    },
    bind: {
        store: '{components}'
    },

    config: {
        initialLoad: false
    },

    autoScroll: true,
    animate: false,
    rootVisible: false,
    allowDeselect: true,

    viewConfig: {},
    columns: [{
        xtype: 'treecolumn',
        dataIndex: 'text',
        text: 'Component ID',
        flex: 2,
        menuDisabled: true,
        draggable: false
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'xtype',
        text: 'XType',
        flex: 1,
        menuDisabled: true,
        draggable: false
    }],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
                xtype: 'button',
                text: 'Refresh',
                iconCls: 'icn-refresh',
                handler: 'onRefreshClick'
            },
            '->', {
                xtype: 'filterfield',
                listeners: {
                    applyfilter: 'onApplyFilter'
                }
            }
        ]
    }],

    listeners: {
        cmpactivate: 'onActivate',
        select: 'onSelectComponent',
        deselect: 'onDeselectComponent',
        scope: 'controller'
    }
});
