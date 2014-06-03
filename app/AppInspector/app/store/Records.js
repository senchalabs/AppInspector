Ext.define('AI.store.Records', {
    extend : 'Ext.data.Store',

    requires : [
        'AI.model.Record',
        'AI.ux.data.proxy.InspectedWindow'
    ],

    model    : 'AI.model.Record',
    storeId  : 'Records',
    pageSize : 50,

    proxy : {
        type   : 'inspectedwindow',
        evalFn : 'AI.util.Store.getRecords',
        reader : {
            type : 'array'
        }
    }
});