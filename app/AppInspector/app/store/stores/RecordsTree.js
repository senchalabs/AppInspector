Ext.define('AI.store.stores.RecordsTree', {
    extend : 'Ext.data.TreeStore',

    requires : [
        'AI.model.Record',
        'Ext.data.proxy.Memory'
    ],

    config : {
        model   : 'AI.model.Record',
        storeId : 'RecordsTree',
        root    : {
            id         : '_ROOT_',
            cls        : 'root',
            iconCls    : 'no-icon',
            expanded   : true,
            expandable : false,
            children   : [

            ]
        },
        proxy   : {
            type : 'memory'
        }
    }
});