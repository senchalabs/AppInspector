Ext.define('AI.store.stores.Stores', {
    extend : 'Ext.data.Store',

    requires : [
        'AI.model.stores.Store'
    ],

    config : {
        model   : 'AI.model.stores.Store',
        storeId : 'Stores'
    }
});
