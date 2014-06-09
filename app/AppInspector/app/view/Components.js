/**
 * @class   AI.view.Components
 * @extends Ext.panel.Panel
 */
Ext.define('AI.view.Components', {
    extend : 'Ext.panel.Panel',
    alias  : 'widget.components',

    requires : [
        'AI.view.ComponentsTreeGrid',
        'AI.view.FilterField',
        'Ext.tree.Panel',
        'Ext.tab.Panel',
        'Ext.grid.Panel',
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',
        'Ext.form.field.Text',
        'Ext.grid.View',
        'Ext.grid.column.Boolean',
        'Ext.tab.Tab',
        'Ext.grid.plugin.CellEditing',
        'Ext.toolbar.TextItem',
        'Ext.layout.container.Border'
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
                            xtype       : 'gridpanel',
                            cls         : 'highlight',
                            itemId      : 'ComponentProps',
                            title       : 'Properties',
                            store       : 'ComponentProps',
                            dockedItems : [
                                {
                                    xtype  : 'toolbar',
                                    dock   : 'top',
                                    border : 1,
                                    cls    : 'components-toolbar top',
                                    items  : [
                                        {
                                            xtype : 'tbfill'
                                        },
                                        {
                                            xtype : 'filterfield'
                                        }
                                    ]
                                }
                            ],
                            viewConfig  : {
                                getRowClass : function (record, rowIndex, rowParams, store) {
                                    var cls = [];

                                    if (record.get('isChanged')) {
                                        cls.push('isChanged');
                                    }

                                    if (record.get('isOwn')) {
                                        cls.push('isOwn');
                                    }

                                    return cls.join(' ');
                                }
                            },
                            columns     : [
                                {
                                    xtype        : 'booleancolumn',
                                    width        : 5,
                                    resizable    : false,
                                    defaultWidth : 5,
                                    sortable     : false,
                                    dataIndex    : 'isOwn',
                                    groupable    : false,
                                    hideable     : false,
                                    lockable     : false,
                                    menuDisabled : true,
                                    tdCls        : 'indicator',
                                    falseText    : ' ',
                                    trueText     : ' '
                                },
                                {
                                    xtype     : 'gridcolumn',
                                    dataIndex : 'name',
                                    text      : 'Name',
                                    flex      : 2
                                },
                                {
                                    xtype     : 'gridcolumn',
                                    dataIndex : 'value',
                                    text      : 'Value',
                                    flex      : 1,
                                    editor    : {
                                        xtype         : 'textfield',
                                        selectOnFocus : true
                                    }
                                }
                            ],
                            plugins     : [
                                Ext.create('Ext.grid.plugin.CellEditing', {

                                })
                            ]
                        },
                        {
                            xtype       : 'gridpanel',
                            cls         : 'highlight',
                            itemId      : 'ComponentMethods',
                            title       : 'Methods',
                            store       : 'ComponentMethods',
                            dockedItems : [
                                {
                                    xtype  : 'toolbar',
                                    dock   : 'top',
                                    border : 1,
                                    cls    : 'components-toolbar top',
                                    items  : [
                                        {
                                            xtype : 'tbfill'
                                        },
                                        {
                                            xtype : 'filterfield'
                                        }
                                    ]
                                }
                            ],
                            viewConfig  : {
                                getRowClass : function (record, rowIndex, rowParams, store) {
                                    var cls = [];

                                    if (record.get('isOverride')) {
                                        cls.push('isOverride');
                                    }

                                    if (record.get('isOwn')) {
                                        cls.push('isOwn');
                                    }

                                    return cls.join(' ');
                                }
                            },
                            columns     : [
                                {
                                    xtype        : 'booleancolumn',
                                    width        : 5,
                                    resizable    : false,
                                    defaultWidth : 5,
                                    sortable     : false,
                                    dataIndex    : 'isOwn',
                                    groupable    : false,
                                    hideable     : false,
                                    lockable     : false,
                                    menuDisabled : true,
                                    tdCls        : 'indicator',
                                    falseText    : ' ',
                                    trueText     : ' '
                                },
                                {
                                    xtype     : 'gridcolumn',
                                    dataIndex : 'name',
                                    text      : 'Name',
                                    flex      : 2
                                },
                                {
                                    xtype     : 'gridcolumn',
                                    dataIndex : 'value',
                                    text      : 'Value',
                                    flex      : 1
                                }
                            ]
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
