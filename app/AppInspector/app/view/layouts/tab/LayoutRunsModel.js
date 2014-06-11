/**
 *
 */
Ext.define('AI.view.layouts.tab.LayoutRunsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.layoutruns',

    requires: [
        'Ext.data.proxy.Memory',
        'AI.model.components.Component'
    ],

    data: {
        recording: false,
        selected: false,
        layoutPool: []
    },

    stores: {
        layoutruns: {
            type: 'tree',
            storeId: 'layoutruns',
            model: 'AI.model.components.Component',
            proxy: {
                type: 'memory'
            },
            root: {
                text: '_LAYOUTRUNS_',
                expanded: true,
                children: []
            }
        }
    }
});
