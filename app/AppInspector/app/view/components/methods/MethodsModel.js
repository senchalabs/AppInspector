/**
 * @class   AI.view.componets.details.methods.MethodsModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.componets.details.methods.MethodsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.methods',

    requires: [
        'Ext.data.Field',
        'Ext.util.Sorter'
    ],

    stores: {
        Methods: {
            storeId: 'Methods',
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
