/**
 * @class   AI.view.MainView
 * @extends Ext.container.Viewport
 */
Ext.define('AI.view.MainView', {
    extend : 'Ext.container.Viewport',
    alias  : 'widget.mainview',

    requires : [
        'AI.view.About',
        'AI.view.Components',
        'AI.view.stores.Stores',
        'AI.view.Layouts',
        'AI.view.Events',
        'AI.view.MVC',
        'Ext.tab.Panel',
        'Ext.tab.Tab',
        'Ext.grid.Panel'
    ],

    itemId : 'mainview',
    layout : 'fit',

    initComponent : function () {
        var me = this;

        Ext.applyIf(me, {
            items : [
                {
                    xtype     : 'tabpanel',
                    activeTab : 0,
                    items     : [
                        {
                            xtype : 'about'
                        },
                        {
                            xtype : 'components'
                        },
                        {
                            xtype : 'stores'
                        },
                        {
                            xtype : 'layouts'
                        },
                        {
                            xtype : 'eventgrid'
                        },
                        {
                            xtype    : 'mvc',
                            disabled : true
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});
