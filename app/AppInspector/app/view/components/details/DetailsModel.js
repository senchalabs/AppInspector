/**
 * @class   AI.view.componets.details.DetailsModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.componets.details.DetailsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.details',

    requires: [
        'Ext.data.Field',
        'Ext.util.Sorter'
    ],

    stores: {
        propstore: {
            // type: 'store',
            storeId: 'propertyDetails',
            fields: ['name', 'value', {
                defaultValue: null,
                name: 'isChanged',
                type: 'boolean',
                useNull: true
            }, {
                defaultValue: null,
                name: 'isOwn',
                type: 'boolean',
                useNull: true
            }],
            sorters: 'name'
        },
        methodstore: {
            // type: 'store',
            storeId: 'methodDetails',
            fields: ['name', 'value', {
                defaultValue: null,
                name: 'isOverride',
                type: 'boolean',
                useNull: true
            }, {
                defaultValue: null,
                name: 'isOwn',
                type: 'boolean',
                useNull: true
            }],
            sorters: 'name'
        },
        bindingsstore: {
            storeId: 'bindingsDetails',
            fields: ['key', 'value', 'boundTo', {
                defaultValue: null,
                name: 'isValid',
                type: 'boolean',
                useNull: true
            }]
        },
        vmstore: {
            txpe: 'tree',
            storeId: 'viewmodelDetails',
            fields: [
                'text', 'value'
            ]
        },
        vcstore: {
            txpe: 'tree',
            storeId: 'viewcontrollerDetails',
            fields: [
                'text', 'leaf'
            ]
        }
    }
});
