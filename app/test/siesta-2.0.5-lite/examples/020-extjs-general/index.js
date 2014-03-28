var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title     : 'Sencha Ext JS examples',

    preload : [
        "http://cdn.sencha.io/ext/gpl/4.2.0/resources/css/ext-all.css",
        "http://cdn.sencha.io/ext/gpl/4.2.0/ext-all-debug.js"
    ]
});


Harness.start(
    '010_ext-bug.t.js',
    '015_ext-combo.t.js',
    {
        url : '020_ext-custom-combo.t.js'
    },
    {
        url : '030_ext-resize.t.js',
        
        // can specify an *additional* preloads (only for tests, not for groups)
        alsoPreload : [
            'http://cdn.sencha.io/ext/gpl/4.2.0/examples/draw/Sencha.js'
        ]
    },
    '040_ext-window.t.js',
    '050_ext-ajax.t.js',
    {
        url : '051_ext-ajax-mock.t.js',

        // Some files from the Ext JS SDK that provide mocking capabilities
        loaderPath  : { 'Ext.ux' : 'http://cdn.sencha.io/ext/gpl/4.2.0/examples/ux' }
    },
    '060_extjs_targeting_buttons.t.js',
    '070_detecting_ext_overrides.t.js'
);

