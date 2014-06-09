/**
 * @class       AI.store.override.mvc.Records
 * @overrides   AI.store.mvc.Records
 */
Ext.define('AI.store.override.mvc.Records', {
    override : 'AI.store.mvc.Records',

    // need to add custom proxy as override
    // otherwise we get a duplicate »type« property linting error
    proxy    : {
        type   : 'inspectedwindow',
        //evalFn: 'AI.util.Store.getRecords',
        reader : {
            type : 'array'
        }
    }
});
