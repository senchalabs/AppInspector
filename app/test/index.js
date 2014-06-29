var Harness = Siesta.Harness.Browser;

Harness.configure({
    title : 'AppInspector Test Suite'
    //autoCheckGlobals : true
});

Harness.start(
    {
        group : 'Sencha Touch',

        loaderPath : {
            'AI' : '../AppInspector/app'
        },

        hostPageUrl : '../../../_touch/touch-2.3.1/examples/list/index.html',

        items : [
            'specs/touch/InspectedWindow.js',
            'specs/touch/Component.js',
            'specs/touch/Store.js',
            'specs/touch/TreeStore.js'
        ]
    },

    /**
     * Ext JS 4 and 5 really ought to test the same page for consistency in the tests.
     * However, Ext JS 5 GA isn't yet available, and for whatever reason the 4.2.1 example throws some console errors (but don't kill the tests)
     */
    {
        group : 'Ext JS 4',

        loaderPath : {
            'AI' : '../AppInspector/app'
        },

        hostPageUrl : '../../../_ext/ext-4.2.1.883/examples/kitchensink/#basic-panels',

        items : [
            'specs/ext4/InspectedWindow.js',
            'specs/ext4/Component.js',
            'specs/ext4/Store.js',
            'specs/ext4/TreeStore.js'
        ]
    },

    {
        group : 'Ext JS 5',

        loaderPath : {
            'AI' : '../AppInspector/app'
        },

        hostPageUrl : '../../../_ext/ext-5.0.0.970/examples/kitchensink/#basic-panels',

        items : [
            'specs/ext5/InspectedWindow.js',
            'specs/ext5/Component.js',
            'specs/ext5/Store.js',
            'specs/ext5/TreeStore.js'
        ]
    }
);

