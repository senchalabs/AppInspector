/**
 * @class   AI.view.main.Main
 * @extends Ext.container.Container
 */
Ext.define('AI.view.main.Main', {
    extend: 'Ext.container.Container',
    xtype: 'main',

    requires: [
        'AI.view.about.About',
        'AI.view.components.Components',
        'AI.view.stores.Stores',
        'AI.view.layouts.Layouts',
        'AI.view.events.Events',
        'AI.view.mvc.MVC'
    ],

    controller: 'main',

    layout: {
        type: 'fit'
    },

    reference: 'main',

    items: [{
        xtype: 'tabpanel',
        itemId: 'navigation',
        activeTab: 2,
        items: [{
            xtype: 'about'
        }, {
            xtype: 'components'
        }, {
            xtype: 'stores'
        }, {
            xtype: 'layouts'
        }, {
            xtype: 'events'
        }, {
            xtype: 'mvc'
        }]
    }],

    listeners: {
        afterrender: 'onAppRender',
        revealcmp: 'onRevealCmp',
        scope: 'controller'
    }
});
