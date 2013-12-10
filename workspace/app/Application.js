Ext.define('AI.Application', {
    name: 'AI',

    requires : [
        'Ext.window.MessageBox',
        'AI.util.Error'
    ],

    extend: 'Ext.app.Application',

    views: [
        // TODO: add views here
    ],

    controllers: [
        'Main',
        'Stores'
    ],

    stores: [
        // TODO: add stores here
    ]
});
