/**
 * @class   AI.view.componets.details.DetailsModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.componets.details.DetailsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.details',

    requires: [
        'Ext.util.Sorter',
        'Ext.data.proxy.Memory',
        'AI.model.components.Detail'
    ],

    stores: {
        propstore: {
            // type: 'store',
            storeId: 'propertyDetails',
            model: 'AI.model.components.Detail',
            sorters: [{
                property: 'name',
                direction: 'ASC'
            }],
            proxy: {
                type: 'memory'
            }
        },
        methodstore: {
            // type: 'store',
            storeId: 'methodDetails',
            model: 'AI.model.components.Detail',
            sorters: [{
                property: 'name',
                direction: 'ASC'
            }],
            proxy: {
                type: 'memory'
            }
        },
        bindingsstore: {
            type: 'tree',
            storeId: 'bindingsDetails',
            model: 'AI.model.components.Detail',
            proxy: {
                type: 'memory'
            }
        }
    }
});
