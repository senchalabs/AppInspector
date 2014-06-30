/**
 *
 */
Ext.define('AI.view.stores.recorddetails.RecordDetailsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.recorddetails',

    requires: [
        'Ext.util.Sorter',
        'Ext.data.Field',
        'Ext.data.proxy.Memory'
    ],

    data: {
        title: 'Record Details'
    },

    stores: {
        RecordDetails: {
            storeId: 'RecordDetails',
            fields: ['text', 'value', {
                name: 'type',
                convert: function (v, rec) {
                    var value = rec.get('value');

                    if (rec.data.id === 'root') {
                        return '';
                    }

                    if (value === null) {
                        return 'null';
                    }

                    // TODO: Date() check needs to be more accurate
                    // if (Ext.isDate(value) || (typeof value === 'string' && Date.parse(value))) {
                    //     return 'date';
                    // }

                    return typeof value;
                }
            }],
            sorters: 'text',
            proxy: {
                type: 'memory'
            }
        }
    }
});
