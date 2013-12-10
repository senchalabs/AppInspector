Ext.define('AI.store.Stores', {
    extend : 'Ext.data.Store',

    requires : [
        'AI.model.Store'
    ],

    model : 'AI.model.Store'
});