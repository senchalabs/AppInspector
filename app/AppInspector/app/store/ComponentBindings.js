Ext.define('AI.store.ComponentBindings', {
    extend : 'Ext.data.Store',

    requires : [
        'Ext.util.Sorter',
        'Ext.data.Field'
    ],

    config : {
        storeId : 'ComponentBindings',
        sorters : {
            property : 'key'
        },
        fields  : [
            {
                name : 'key',
                type : 'string'
            },
            {
                name : 'value',
                type : 'auto'
            },
            {
                name : 'boundTo',
                type : 'auto'
            },
            {
                defaultValue : null,
                name         : 'isValid',
                type         : 'boolean',
                useNull      : true
            }
        ]

    }
});
