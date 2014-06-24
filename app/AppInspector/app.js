// @require @packageOverrides
Ext.Loader.setConfig({
    enabled: true,
    paths : {
        d3xtjs : 'packages/d3xtjs/src/'
    }
});

Ext.application({

    requires: [
        'AI.util.i18n',
        'Ext.window.MessageBox'
    ],
    controllers: [
        'Main',
        'Components',
        'Stores',
        'Layouts',
        'Events',
        'MVC'
    ],
    name: 'AI',

    launch: function() {
        Ext.create('AI.view.MainView');
    }

});