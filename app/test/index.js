var Harness = Siesta.Harness.Browser;

Harness.configure({
    title            : 'AppInspector Test Suite'
    //autoCheckGlobals : true
});

Harness.start(
//
//    {
//        hostPageUrl : '../AppInspector/index.html',
//        url         : 'specs/InspectedWindow.js'
//    },
//
//    {
//        group : 'Sencha Touch',
//
//        loaderPath : {
//            'AI' : '../AppInspector/app'
//        },
//
//        hostPageUrl : 'http://sencha.local/_touch/touch-2.3.1/examples/geocongress/index.html',
//
//        items : [
//            'specs/InspectedWindow.js'
//        ]
//    },

    {
        group : 'Ext JS 4',

        loaderPath : {
            'AI' : '../AppInspector/app'
        },

        hostPageUrl : 'http://sencha.local/_ext/ext-4.2.1.883/examples/themes/index.html',

        items : [
            'specs/ext4/InspectedWindow.js'
        ]
    }

//    {
//        group : 'Ext JS 5',
//
//        loaderPath : {
//            'AI' : '../AppInspector/app'
//        },
//
//        hostPageUrl : 'http://sencha.local/_ext/ext-5.0.0.470-pb2/examples/themes/index.html',
//
//        items : [
//            'specs/InspectedWindow.js'
//        ]
//    }
);

