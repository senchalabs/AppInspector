Ext.define('AI.store.stores.RecordsTree', {
    extend : 'Ext.data.TreeStore',

    requires : [
        'AI.model.TreeRecord',
        'Ext.data.proxy.Memory'
    ],

    config : {
        model   : 'AI.model.TreeRecord',
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