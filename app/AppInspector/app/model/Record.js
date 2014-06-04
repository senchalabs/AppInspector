Ext.define('AI.model.Record', {
    extend : 'Ext.data.TreeModel',

    requires : [
        'Ext.data.Field',
        'Ext.data.identifier.Uuid'
    ],

    fields : [
        {
            defaultValue : true,
            name         : 'isLeaf',
            type         : 'boolean'
        },
        {
            name : 'modelData',
            type : 'string'     //serialized model data from the Inspected Window
        }
    ],

    identifier : {
        type : 'uuid'
    }
});