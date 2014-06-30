/**
 *
 */
Ext.define('AI.view.layouts.Layouts', {
    extend: 'Ext.tab.Panel',
    xtype: 'layouts',

    requires: [
        'AI.view.layouts.boxlayouts.BoxLayouts',
        'AI.view.layouts.overnesting.Overnesting',
        'AI.view.layouts.layoutruns.LayoutRuns'
    ],

    controller: 'layouts',
    // viewModel: {
    //     type: 'layouts'
    // },

    title: 'Layouts',
    glyph: 'xf108@fontawesome',
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
        beforeadd: {
            fn: 'localize',
            single: true
        },
        layoutselect: 'onLayoutSelect',
        scope: 'controller'
    }
});
