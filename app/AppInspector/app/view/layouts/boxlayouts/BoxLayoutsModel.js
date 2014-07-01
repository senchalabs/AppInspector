/**
 * @class   AI.view.layouts.boxlayouts.BoxLayoutsModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.layouts.boxlayouts.BoxLayoutsModel', {
    extend: 'Ext.app.ViewModel',
    alias : 'viewmodel.boxlayouts',

    requires: [
        'Ext.util.Sorter',
        'Ext.data.proxy.Memory',
        'AI.model.Base'
    ],

    data: {
        selected: false
    },

    stores: {
        BoxLayouts: {
            storeId: 'BoxLayouts',
            model  : 'AI.model.Base',
            sorters: 'cmpId',
            proxy  : {
                type: 'memory'
            }
        }
    }
});
