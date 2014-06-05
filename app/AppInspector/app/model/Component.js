/**
 * @class   AI.model.Component
 * @extends Ext.data.Model
 */
Ext.define('AI.model.Component', {
    extend : 'Ext.data.TreeModel',

    requires : [
        'Ext.data.Field',
        'Ext.data.identifier.Uuid'
    ],

    fields : [
        {
            name : 'xclass'
        },
        {
            name : 'xtype'
        },
        {
            name : 'cmpId'
        },
        {
            name : 'itemId'
        },
        {
            name : 'name'
        }
    ],

    identifier : {
        type : 'uuid'
    }
});
