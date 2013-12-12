Ext.define('AI.model.Component', {
    extend : 'Ext.data.TreeModel',

    fields : [
        { name : 'text',   type : 'string' },
        { name : 'xclass', type : 'string' },
        { name : 'xtype',  type : 'string' },
        { name : 'cmpId',  type : 'string' },
        { name : 'itemId', type : 'string' },
        { name : 'name',   type : 'string' }
    ]
});