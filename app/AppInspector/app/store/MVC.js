Ext.define('AI.store.MVC', {
    extend : 'Ext.data.TreeStore',

    requires : [
        'AI.model.mvc.Tree'
    ],

    model   : 'AI.model.mvc.Tree',
    storeId : 'MVC',
    root    : {
        children : [

        ]
    }
});