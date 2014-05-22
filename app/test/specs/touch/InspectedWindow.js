StartTest({
    preload : [
        '../AppInspector/mocks.js',
        '../AppInspector/app/util/Error.js',
        '../AppInspector/app/util/InspectedWindow.js'
    ]
}, function (test) {

    if (!Ext.ux) {
        Ext.ns('Ext.ux');
    }

    //=================================================================
    test.diag("AI.util.InspectedWindow.getAppVersion()");
    test.is(Ext.ux.AppInspector, undefined, 'Ext.ux.AppInspector is not yet defined.');

    AI.util.InspectedWindow.eval(
        AI.util.InspectedWindow.getAppDetails,
        null,
        function(data, isException) {

            test.isNot(Ext.ux.AppInspector, undefined, 'Ext.ux.AppInspector is defined.');

            test.isNot(data.versions.touch, undefined, 'Framework is Touch');
            test.is(data.versions.touch, '2.3.1', 'Touch version is 2.3.1');
        }
    );
});
