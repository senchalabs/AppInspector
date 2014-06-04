Ext.define('AI.model.mvc.Listeners', {
    extend : 'Ext.data.Model',

    requires : [
        'Ext.data.Field'
    ],

    config : {
        fields : [
            {
                name : 'domain'
            },
            {
                name : 'selector'
            },
            {
                name : 'event'
            },
            {
                name : 'method'
            }
        ]
    }
});