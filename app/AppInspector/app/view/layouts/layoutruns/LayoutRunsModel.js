/**
 * @class   AI.view.layouts.layoutruns.LayoutRunsModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.layouts.layoutruns.LayoutRunsModel', {
    extend: 'Ext.app.ViewModel',
    alias : 'viewmodel.layoutruns',

    requires: [
        'Ext.data.Field',
        'Ext.data.proxy.Memory',
        'Ext.util.Sorter'
    ],

    data: {
        recording : false,
        selected  : false,
        layoutPool: []
    },

    stores: {
        LayoutRuns: {
            type       : 'tree',
            storeId    : 'LayoutRuns',
            fields     : ['text', 'xtype'],
            rootVisible: false,
            root       : {
                text    : '_LAYOUTRUNS_',
                expanded: true,
                children: []
            },
            proxy      : {
                type: 'memory'
            }
        }
    }
});
