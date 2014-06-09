/**
 * @class   AI.model.Event
 * @extends Ext.data.Model
 */
Ext.define('AI.model.Event', {
    extend : 'Ext.data.Model',

    requires : [
        'Ext.data.Field'
    ],

    fields : [
        {
            name : 'eventName'
        },
        {
            name : 'xtype'
        },
        {
            name : 'source'
        },
        {
            name : 'cmpId'
        }
    ]
});
