Ext.define('AI.store.Records', {
    extend : 'Ext.data.Store',

    requires : [
        'AI.model.Record'
    ],

    model : 'AI.model.Record'
});