/**
 * @class   AI.model.Store
 * @extends Ext.data.Model
 */
Ext.define('AI.model.Store', {
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
            defaultValue : false,
            name         : 'leaf',
            type         : 'boolean'
        }
    ]
});
