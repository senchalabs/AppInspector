var Harness = Siesta.Harness.Browser.SenchaTouch;

Harness.configure({
    title     : 'Sencha Touch 2 samples',

    preload : [
        "http://cdn.sencha.com/touch/sencha-touch-2.2.1/resources/css/sencha-touch.css",
        "http://cdn.sencha.com/touch/sencha-touch-2.2.1/sencha-touch-all-debug.js"
    ],
    
    keepNLastResults    : 2
});

Harness.start(
// TODO: Uncomment this test once http://www.sencha.com/forum/showthread.php?265680-2.2.1-Map-example-is-broken&p=973413
// will be fixed
//    {
//        url             : '010_map.t.js',
//        performSetup    : false,       // This is done by the maps example itself
//        alsoPreload     : [
//            "http://maps.google.com/maps/api/js?sensor=true",
//            "http://cdn.sencha.com/touch/sencha-touch-2.2.1/examples/map/app.js",
//            "http://cdn.sencha.com/touch/sencha-touch-2.2.1/examples/map/lib/plugin/google/Tracker.js",
//            "http://cdn.sencha.com/touch/sencha-touch-2.2.1/examples/map/lib/plugin/google/Traffic.js"
//        ]
//    },
    '011_carousel.t.js',
    '012_form.t.js',
    '013_buttons.t.js',
    '014_events.t.js',
    '015_nested_list.t.js',
    '016_contact_list.t.js',
    '017_tabs.t.js',
    '../examples/010-basics/060_bdd.t.js',
    {
        group           : 'Application tests',
        hostPageUrl     : 'DemoApp/',
        performSetup    : false,       // This is done by the app itself
        items           : [
            'DemoApp/tests/100_sanity.t.js',
            'DemoApp/tests/101_login.t.js',
            'DemoApp/tests/102_logout.t.js'
        ]
    }
);
// eof Harness.start

