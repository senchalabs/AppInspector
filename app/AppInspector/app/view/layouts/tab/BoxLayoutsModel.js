/**
 *
 */
Ext.define('AI.view.layouts.tab.BoxLayoutsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.boxlayouts',

    requires: [
        'Ext.util.Sorter',
        'Ext.data.proxy.Memory',
        'AI.model.layouts.Layout'
    ],

    data: {
        selected: false
    },

    stores: {
        BoxLayouts: {
            storeId: 'BoxLayouts',
            model: 'AI.model.layouts.Layout',
            sorters: 'cmpId',
            proxy: {
                type: 'memory'
            }
        }
    }
});
