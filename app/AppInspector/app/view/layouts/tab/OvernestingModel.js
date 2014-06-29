/**
 *
 */
Ext.define('AI.view.layouts.tab.OvernestingModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.overnesting',

    requires: [
        'Ext.util.Sorter',
        'Ext.data.proxy.Memory',
        'AI.model.layouts.Layout'
    ],

    data: {
        selected: false
    },
    stores: {
        overnesting: {
            storeId: 'overnesting',
            model: 'AI.model.layouts.Layout',
            sorters: 'cmpId',
            proxy: {
                type: 'memory'
            }
        }
    }
});
