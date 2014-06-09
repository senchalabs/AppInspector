/**
 * @class   AI.store.mvc.Records
 * @extends Ext.data.Store
 */
Ext.define('AI.store.mvc.Records', {
    extend : 'Ext.data.Store',

    requires : [
        'AI.model.Record',
        'AI.store.override.mvc.Records',
        'AI.ux.data.proxy.InspectedWindow'
    ],

    config : {
        model    : 'AI.model.Record',
        storeId  : 'mvc.Records',
        pageSize : 50
    }
});
