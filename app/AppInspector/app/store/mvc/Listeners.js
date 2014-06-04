Ext.define('AI.store.mvc.Listeners', {
    extend : 'Ext.data.Store',

    requires : [
        'AI.model.mvc.Listeners'
    ],

    config : {
        model      : 'AI.model.mvc.Listeners',
        storeId    : 'mvc.Listeners',
        groupField : 'domain'
    }
});