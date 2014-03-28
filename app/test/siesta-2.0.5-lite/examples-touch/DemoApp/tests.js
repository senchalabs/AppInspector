var Harness = Siesta.Harness.Browser.SenchaTouch;

Harness.configure({
    title       : 'Sencha Touch 2 samples',
    testClass   : Your.Test.Class,

    // this preload can be used by some other tests in your suite, the tests with `hostPageUrl`
    // config will ignore this preload, as everything that should be loaded should be on the page
    preload     : [
        "http://cdn.sencha.com/touch/sencha-touch-2.2.1/resources/css/sencha-touch.css",
        "http://cdn.sencha.com/touch/sencha-touch-2.2.1/sencha-touch-all-debug.js"
    ]
});

Harness.start(
    {
        group           : 'Application tests',
        // will ignore the `preload` config
        hostPageUrl     : './',
        performSetup    : false,       // This is done by the app itself
        items           : [
            'tests/100_sanity.t.js',
            'tests/101_login.t.js',
            'tests/102_logout.t.js'
        ]
    },
    {
        group           : 'Tests with auto login',
        // will ignore the `preload` config
        hostPageUrl     : './',
        performSetup    : false,       // This is done by the app itself
        items           : [
            'tests/auto_login/010_sanity.t.js'
        ]
    }
);
// eof Harness.start

