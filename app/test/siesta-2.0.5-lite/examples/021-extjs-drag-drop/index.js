var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title     : 'ExtJS Drag and Drop Test Suite',

    preload : [
        "http://cdn.sencha.io/ext/gpl/4.2.0/resources/css/ext-all.css",
        "http://cdn.sencha.io/ext/gpl/4.2.0/ext-all-debug.js"
    ]
});


Harness.start(
    {
        // Specify your own HTML page if you want
        hostPageUrl     : 'cats.html',
        url             : '010_drag-drop.t.js'
    },
    '020_dd-tree.t.js',
    {
        url             : '030_ext-calendar.t.js',
        alsoPreload         : [
            'http://ext.ensible.com/deploy/dev/resources/css/extensible-all.css',
            'http://ext.ensible.com/deploy/dev/extensible-all-debug.js',
            {
                text    : 
                    "Ext.onReady(function() {Ext.getBody().createChild({ id : 'panel'});Ext.getBody().createChild({ id : 'simple'}); });"+
                    "Ext.Loader.setConfig({"+
                    "    enabled: true,"+
                    "    disableCaching: false,"+
                    "    paths: {"+
                    "        'Extensible': 'http://ext.ensible.com/deploy/dev/src',"+
                    "        'Extensible.example': 'http://ext.ensible.com/deploy/dev/examples/'"+
                    "    }" +
                    "});"
            }, 
            'http://ext.ensible.com/deploy/dev/examples/calendar/basic.js'
        ]
    }
);

