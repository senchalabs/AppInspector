Ext.define('AI.store.components.Methods', {
    extend : 'Ext.data.Store',

    requires : [
        'Ext.util.Sorter',
        'Ext.data.Field'
    ],

    config : {
        storeId : 'ComponentMethods',
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
                name         : 'isOverride',
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
