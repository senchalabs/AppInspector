var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title     : 'Sencha Ext JS examples',

    preload : [
        "http://cdn.sencha.io/ext-3.4.0/resources/css/ext-all.css",
        "http://cdn.sencha.io/ext-3.4.0/adapter/ext/ext-base-debug.js",
        "http://cdn.sencha.io/ext-3.4.0/ext-all-debug.js"
    ]
});


Harness.start(
    '010_ext-resize.t.js',
    '020_ext-window.t.js',
    '030_ext-grid.t.js'
);

