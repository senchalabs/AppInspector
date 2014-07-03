/**
 * @class   AI.view.layouts.overnesting.OvernestingModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.layouts.overnesting.OvernestingModel', {
    extend: 'Ext.app.ViewModel',
    alias : 'viewmodel.overnesting',

    requires: [
        'Ext.util.Sorter',
        'Ext.data.proxy.Memory',
        'AI.model.Base'
    ],

    data: {
        selected: false
    },

    stores: {
        Overnestings: {
            storeId: 'Overnestings',
            model  : 'AI.model.Base',
            sorters: 'cmpId',
            proxy  : {
                type: 'memory'
            }
        }
    }
});
