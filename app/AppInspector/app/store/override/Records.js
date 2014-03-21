Ext.define('AI.store.override.Records', {
    override: 'AI.store.Records',
    
    // need to add custom proxy as override
    // otherwise we get a duplicate »type« property linting error
    proxy: {
        type: 'inspectedwindow',
        reader: {
            type: 'array'
        }
    }
});