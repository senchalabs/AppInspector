/**
 * @class   AI.model.stores.Store
 * @extends Ext.data.Model
 */
Ext.define('AI.model.stores.Store', {
    extend : 'Ext.data.Model',

    requires : [
        'Ext.data.Field'
    ],

    fields : [
        {
            name : 'id'
        },
        {
            name : 'count'
        },
        {
            name : 'model'
        },
        {
            defaultValue : false,
            name         : 'isTree',
            type         : 'boolean'
        },
        {
            defaultValue : false,
            name         : 'leaf',
            type         : 'boolean'
        }
    ]
});
