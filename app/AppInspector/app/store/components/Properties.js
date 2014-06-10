Ext.define('AI.store.components.Properties', {
    extend : 'Ext.data.Store',

    requires : [
        'Ext.util.Sorter',
        'Ext.data.Field'
    ],

    config : {
        storeId : 'ComponentProps',
        sorters : {
            property : 'name'
        },
        fields  : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'value',
                type : 'auto'
            },
            {
                defaultValue : null,
                name         : 'isChanged',
                type         : 'boolean',
                useNull      : true
            },
            {
                defaultValue : null,
                name         : 'isOwn',
                type         : 'boolean',
                useNull      : true
            }
        ]
    }
});
