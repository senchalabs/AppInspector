/**
 * @class   AI.view.componets.details.MethodsModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.componets.details.MethodsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.methods',

    requires: [
        'Ext.data.Field',
        'Ext.util.Sorter'
    ],

    stores: {
        methodstore: {
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
        }
    }
});
