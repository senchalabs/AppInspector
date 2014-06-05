/**
 * @class   AI.store.Layouts
 * @extends Ext.data.TreeStore
 */
Ext.define('AI.store.Layouts', {
    extend : 'Ext.data.TreeStore',

    requires : [
        'AI.model.Component',
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json'
    ],

    config : {
        autoLoad : true,
        model    : 'AI.model.Component',
        storeId  : 'Layouts',
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
