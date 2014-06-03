Ext.define('AI.model.TreeRecord', {
    extend : 'Ext.data.TreeModel',

    requires : [
        'Ext.data.Field',
        'Ext.data.identifier.Uuid'
    ],

    fields : [
        {
            name : 'id'
        },
        {
            defaultValue : true,
            name         : 'isLeaf',
            type         : 'boolean'
        },
        {
            name : 'text'
        }
    ],

    idgen : {
        type : 'uuid'
    }
});