/**
 * @class   AI.model.Overnested
 * @extends Ext.data.Model
 */
Ext.define('AI.model.Overnested', {
    extend : 'Ext.data.Model',

    requires : [
        'Ext.data.Field'
    ],

    fields : [
        {
            name : 'cmpId'
        },
        {
            name : 'xtype'
        }
    ]
});
