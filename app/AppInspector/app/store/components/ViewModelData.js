Ext.define('AI.store.components.ViewModelData', {
    extend : 'Ext.data.TreeStore',

    requires : [
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json'
    ],

    config : {
        autoLoad : true,
        //model    : 'AI.model.Component',
        //storeId  : 'ComponentViewModelData',

        fields : [
            'text', 'value'
        ],

        proxy : {
            type   : 'memory',
            reader : {
                type : 'json'
            }
        },

        root : {
            children : [

            ]
        }
    }
});
