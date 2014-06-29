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

            test.isNot(data.versions.extjs, undefined, 'Framework is Ext JS');
            test.is(data.versions.extjs, '5.0.0.970', 'Ext JS version is 5.0.0.970');
        }
    );
});
