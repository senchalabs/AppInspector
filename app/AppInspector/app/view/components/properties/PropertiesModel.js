/**
 * @class   AI.view.componets.details.properties.PropertiesModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.componets.details.properties.PropertiesModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.properties',

    requires: [
        'Ext.data.Field',
        'Ext.util.Sorter'
    ],

    stores: {
        Properties: {
            storeId: 'Properties',
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
        }
    }
});
