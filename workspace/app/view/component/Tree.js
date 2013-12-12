Ext.define('AI.view.component.Tree', {
    extend : 'Ext.tree.Panel',
    xtype  : 'ai-view-component-tree',

    requires : [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.data.TreeStore',
        'Ext.tree.Column',
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json',
        'AI.model.Component'
    ],

    rootVisible  : false,
    //singleExpand : true,
    useArrows    : true,

    dockedItems : [
        {
            xtype : 'toolbar',
            dock  : 'top',
            items : [
                {
                    xtype  : 'button',
                    itemId : 'RefreshComponentTree',
                    text   : 'Refresh'
                }
            ]
        }
    ],

    columns : [
        {
            xtype     : 'treecolumn',
            text      : 'Component ID',
            dataIndex : 'text',
            flex      : 1
        },
        {
            text      : 'XType',
            dataIndex : 'xtype',
            flex      : 1
        }
    ],

    initComponent : function () {
        this.store = Ext.create('Ext.data.TreeStore', {
            model : 'AI.model.Component',
            proxy : {
                type   : 'memory',
                data   : [],
                reader : {
                    type : 'json'
                }
            }
        });

        this.callParent();
    }
});