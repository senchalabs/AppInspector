/**
 * @class   AI.view.components.Components
 * @extends Ext.panel.Panel
 */
Ext.define('AI.view.components.Components', {
    extend: 'Ext.panel.Panel',
    xtype: 'components',

    requires: [
        'Ext.layout.container.Border',
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',
        'Ext.toolbar.TextItem',
        'AI.view.components.tree.Tree',
        'AI.view.components.properties.Properties',
        'AI.view.components.methods.Methods',
        'AI.view.components.bindings.Bindings',
        'AI.view.components.viewmodeldata.ViewModelData',
        // 'AI.view.components.ciewcontrollerdata.ViewControllerData',
        'AI.view.components.inheritancemodel.InheritanceModel'
    ],

    config: {
        initialLoad: false
    },

    controller: 'components',
    viewModel: {
        type: 'components'
    },

    title: 'Components',
    glyph: 'xf0e8@fontawesome',
    layout: {
        type: 'border'
    },

    items: [
        {
            region: 'center',
            xtype: 'componentstree',
            reference: 'componentstree',
            flex: 1
        },
        {
            region: 'east',
            xtype: 'tabpanel',
            flex: 1,
            split: true,
            minWidth: 100,
            activeTab: 0,
            minTabWidth: 45,
            defaults: {
                listeners: {
                    activate: 'toggleDetailsTips',
                    validateedit: 'onDetailValueEdit'
                }
            },
            bind: {
                disabled: '{!selection}'
            },
            items: [
                {
                    xtype: 'properties',
                    reference: 'properties'
                },
                {
                    xtype: 'methods',
                    reference: 'methods'
                },
                {
                    xtype: 'bindings',
                    reference: 'bindings',
                    bind: {
                        disabled: '{!tabs.bindings}'
                    }
                },
                {
                    xtype: 'viewmodeldata',
                    reference: 'vm',
                    bind: {
                        disabled: '{!tabs.viewmodeldata}'
                    }
                    // }, {
                    //     xtype: 'viewcontrollerdata',
                    //     reference: 'vc',
                    //     bind: {
                    //         disabled: '{!tabs.viewcontrollerdata}'
                    //     }
                },
                {
                    xtype: 'inheritancemodel',
                    reference: 'inheritancemodel',
                    bind: {
                        disabled: '{!tabs.inheritancemodel}'
                    }
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    cls: 'components-tips',
                    reference: 'componentstips',
                    defaults: {
                        xtype: 'tbtext',
                        flex: 1,
                        maxWidth: 125
                    },
                    items: [
                        {
                            cls: 'tip-changed',
                            text: 'Changed ',
                            bind: {
                                hidden: '{!isPropertiesTip}'
                            }
                        },
                        {
                            cls: 'tip-override',
                            text: 'Override',
                            bind: {
                                hidden: '{!isMethodsTip}'
                            }
                        },
                        {
                            cls: 'tip-custom',
                            text: 'Custom ',
                            bind: {
                                hidden: '{!isPropertiesOrMethodsTip}'
                            }
                        },
                        {
                            cls: 'tip-binding error',
                            text: 'Binding Error',
                            bind: {
                                hidden: '{!isBindingsTip}'
                            }
                        },
                        {
                            cls: 'tip-changed',
                            text: 'Superclass',
                            bind: {
                                hidden: '{!isInheritanceModelTip}'
                            }
                        },
                        {
                            cls: 'tip-override',
                            text: 'Mixin',
                            bind: {
                                hidden: '{!isInheritanceModelTip}'
                            }
                        },
                        {
                            xtype: 'tbtext',
                            maxWidth: 1,
                            text: '&nbsp;'
                        }
                    ]
                }
            ]
        }
    ],

    listeners: {
        activate: 'onActivate',
        beforeadd: {
            fn: 'localize',
            single: true
        },
        scope: 'controller'
    }
});
