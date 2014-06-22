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
        'AI.view.components.details.Properties',
        'AI.view.components.details.Methods',
        'AI.view.components.details.Bindings',
        'AI.view.components.details.ViewModelData',
        'AI.view.components.details.ViewControllerData'
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

    items: [{
        region: 'center',
        xtype: 'componentstree',
        reference: 'componentstree',
        flex: 1
    }, {
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
        items: [{
            xtype: 'properties',
            reference: 'properties'
        }, {
            xtype: 'methods',
            reference: 'methods'
        }, {
            xtype: 'bindings',
            reference: 'bindings',
            bind: {
                disabled: '{!tabs.bindings}'
            }
        }, {
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
        }],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            cls: 'components-tips',
            reference: 'componentstips',
            items: [{
                xtype: 'tbtext',
                flex: 1,
                maxWidth: 125,
                cls: 'tip-changed',
                text: 'Changed ',
                bind: {
                    hidden: '{!propertiesTip}'
                }
            }, {
                xtype: 'tbtext',
                flex: 1,
                maxWidth: 125,
                cls: 'tip-override',
                text: 'Override',
                bind: {
                    hidden: '{!methodsTip}'
                }
            }, {
                xtype: 'tbtext',
                flex: 1,
                maxWidth: 125,
                cls: 'tip-custom',
                text: 'Custom ',
                bind: {
                    hidden: '{!propertiesOrMethodsTip}'
                }
            }, {
                xtype: 'tbtext',
                flex: 1,
                maxWidth: 125,
                cls: 'tip-binding error',
                text: 'Binding Error',
                bind: {
                    hidden: '{!bindingsTip}'
                }
            }, {
                xtype: 'tbtext',
                maxWidth: 1,
                text: '&nbsp;'
            }]
        }]
    }],

    listeners: {
        activate: 'onActivate',
        beforeadd: {
            fn: 'localize',
            single: true
        },
        scope: 'controller'
    }
});
