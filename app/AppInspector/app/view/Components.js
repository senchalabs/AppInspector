Ext.define('AI.view.Components', {
    extend : 'Ext.panel.Panel',
    alias  : 'widget.components',

    requires : [
        'Ext.tree.Panel',
        'Ext.tab.Panel',

        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',
        'Ext.toolbar.TextItem',
        'Ext.layout.container.Border',

        'AI.view.components.ComponentsTreeGrid',
        'AI.view.components.Bindings',
        'AI.view.components.Methods',
        'AI.view.components.Properties',
        'AI.view.components.ViewModels'
    ],

    initialLoad : false,
    itemId      : 'ComponentInspector',
    layout      : 'border',
    iconCls     : 'icn-components',
    title       : 'Components',

    initComponent : function () {
        var me = this;

        Ext.applyIf(me, {
            items     : [
                {
                    xtype  : 'componentstreegrid',
                    itemId : 'ComponentTree',
                    flex   : 1,
                    region : 'center'
                },
                {
                    xtype       : 'tabpanel',
                    flex        : 1,
                    region      : 'east',
                    split       : true,
                    itemId      : 'ComponentDetails',
                    minWidth    : 100,
                    activeTab   : 0,
                    minTabWidth : 45,
                    items       : [
                        {
                            xtype : 'ai-components-properties'
                        },
                        {
                            xtype : 'ai-components-methods'
                        },
                        {
                            xtype : 'ai-components-bindings'
                        },
                        {
                            xtype : 'ai-components-viewmodels'
                        }
                    ],

                    dockedItems : [
                        {
                            xtype  : 'toolbar',
                            dock   : 'bottom',
                            cls    : 'components-tips',
                            itemId : 'ComponentsTips',
                            items  : [
                                {
                                    xtype : 'tbfill',
                                    flex  : 2
                                },
                                {
                                    xtype    : 'tbtext',
                                    tipGroup : 'props',
                                    flex     : 1,
                                    cls      : 'tip-changed',
                                    text     : 'Changed'
                                },
                                {
                                    xtype    : 'tbtext',
                                    tipGroup : 'both',
                                    flex     : 1,
                                    cls      : 'tip-custom',
                                    text     : 'Custom'
                                },
                                {
                                    xtype    : 'tbtext',
                                    tipGroup : 'methods',
                                    flex     : 1,
                                    cls      : 'tip-override',
                                    hidden   : true,
                                    text     : 'Override'
                                }
                            ]
                        }
                    ]
                }
            ],
            listeners : {
                beforeadd : {
                    fn    : me.onComponentInspectorBeforeAdd,
                    scope : me
                }
            }
        });

        me.callParent(arguments);
    },

    onComponentInspectorBeforeAdd : function (container, component, index, eOpts) {
        this.setTitle(AI.util.i18n.getMessage(this.title));
    }

});
