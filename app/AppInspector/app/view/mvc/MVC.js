/**
 *
 */
Ext.define('AI.view.mvc.MVC', {
    extend: 'Ext.panel.Panel',
    xtype : 'mvc',

    requires: [
        'AI.view.mvc.tree.Tree',
        'AI.view.mvc.listeners.Listeners',
        'AI.view.mvc.records.Records'
    ],

    controller: 'mvc',
    // viewModel: {
    //     type: 'mvc-mvc'
    // },

    title: 'MVC',
    glyph: 'xf1e0@fontawesome',

    layout: {
        type : 'vbox',
        align: 'stretch'
    },

    defaults: {
        hidden: true,
        flex  : 2
    },
    items   : [
        {
            xtype : 'mvctree',
            hidden: false,
            flex  : 1
        },
        {
            xtype: 'mvclisteners'
        },
        {
            xtype: 'mvcrecords'
        }
    ],

    listeners: {
        activate: {
            fn: 'onActivate',
            single: true
        },
        beforeadd: {
            fn: 'localize',
            single: true
        },
        scope: 'controller'
    }
});
