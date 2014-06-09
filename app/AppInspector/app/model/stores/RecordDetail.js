/**
 * @class   AI.model.stores.RecordDetail
 * @extends Ext.data.Model
 */
Ext.define('AI.model.stores.RecordDetail', {
    extend : 'Ext.data.Model',

    requires : [
        'Ext.data.Field'
    ],

    fields : [
        {
            name : 'text'
        },
        {
            name : 'value'
        },
        {
            convert : function (v, rec) {
                var value = rec.get('value');

                if (rec.data.id === 'root') {
                    return '';
                }

                if (value === null) {
                    return 'null';
                }

                /*
                 // TODO: Date() check needs to be more accurate
                 if (Ext.isDate(value) || (typeof value === 'string' && Date.parse(value))) {
                 return 'date';
                 }
                 */

                return typeof value;
            },
            name    : 'type'
        }
    ]
});
