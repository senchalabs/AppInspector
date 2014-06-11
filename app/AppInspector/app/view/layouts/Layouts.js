/**
 *
 */
Ext.define('AI.view.layouts.Layouts', {
    extend: 'Ext.tab.Panel',
    xtype: 'layouts',

    requires: [
        'AI.view.layouts.tab.BoxLayouts',
        'AI.view.layouts.tab.Overnesting',
        'AI.view.layouts.tab.LayoutRuns'
    ],

    controller: 'layouts',
    // viewModel: {
    //     type: 'layouts'
    // },

    iconCls: 'icn-layouts',
    title: 'Layouts',
    activeTab: 0,
    tabPosition: 'right',

    items: [{
        xtype: 'boxlayouts',
        itemId: 'boxlayouts'
    }, {
        xtype: 'overnesting',
        itemId: 'overnesting'
    }, {
        xtype: 'layoutruns',
        itemId: 'layoutruns'
    }],

    listeners: {
        layoutselect: 'onLayoutSelect',
        scope: 'controller'
    }
});
