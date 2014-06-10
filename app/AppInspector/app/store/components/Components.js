Ext.define('AI.store.components.Components', {
    extend : 'Ext.data.TreeStore',

    requires : [
        'AI.model.Component',
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json'
    ],

    config : {
        autoLoad : true,
        model    : 'AI.model.Component',
        storeId  : 'Components',
        proxy    : {
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
