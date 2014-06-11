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
        'AI.view.components.details.Bindings'
    ],

    config: {
        initialLoad: false
    },

    controller: 'components',
    viewModel: {
        type: 'components'
    },

    title: 'Components',
    iconCls: 'icn-components',
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
        bind: {
            disabled: '{!componentstree.selected}'
        },
        items: [{
            xtype: 'properties',
            reference: 'properties',
            listeners: {
                activate: 'toggleComponentsDetailsTips',
                validateedit: 'onDetailValueEdit'
            }
        }, {
            xtype: 'methods',
            reference: 'methods',
            listeners: {
                activate: 'toggleComponentsDetailsTips'
            }
        }, {
            xtype: 'bindings',
            reference: 'bindings',
            bind: {
                // disabled: '{!componentstree.isMVVM}'
            },
            listeners: {
                activate: 'toggleComponentsDetailsTips'
            }
        }],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            cls: 'components-tips',
            reference: 'componentstips',
            items: [{
                xtype: 'tbtext',
                tipGroup: 'props',
                flex: 1,
                maxWidth: 125,
                cls: 'tip-changed',
                text: 'Changed ',
                bind: {
                    hidden: '{!componentsdetails.properties}'
                }
            }, {
                xtype: 'tbtext',
                tipGroup: 'both',
                flex: 1,
                maxWidth: 125,
                cls: 'tip-custom',
                text: 'Custom ',
                bind: {
                    hidden: '{componentsdetails.bindings}'
                }
            }, {
                xtype: 'tbtext',
                tipGroup: 'methods',
                flex: 1,
                maxWidth: 125,
                cls: 'tip-override',
                text: 'Override',
                bind: {
                    hidden: '{!componentsdetails.methods}'
                }
            }, {
                xtype: 'tbtext',
                tipGroup: 'bindings',
                flex: 1,
                maxWidth: 125,
                cls: 'tip-binding error',
                text: 'Binding Error',
                bind: {
                    hidden: '{!componentsdetails.bindings}'
                }
            }]
        }]
    }],

    listeners: {
        activate: 'onActivate',
        beforeadd: 'localize',
        scope: 'controller'
    }
});
