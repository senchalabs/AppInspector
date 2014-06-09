/**
 * @class   AI.store.MVC
 * @extends Ext.data.TreeStore
 */
Ext.define('AI.store.MVC', {
    extend : 'Ext.data.TreeStore',

    requires : [
        'AI.model.mvc.Tree'
    ],

    config : {
        model   : 'AI.model.mvc.Tree',
        storeId : 'MVC',
        root    : {
            children : [

            ]
        },

        proxy : {
            type   : 'memory',
            reader : {
                type : 'json'
            }
        }
    }
});
