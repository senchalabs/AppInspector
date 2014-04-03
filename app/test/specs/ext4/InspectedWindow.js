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
        AI.util.InspectedWindow.getAppVersion,
        null,
        function(data, isException) {

            test.isNot(Ext.ux.AppInspector, undefined, 'Ext.ux.AppInspector is defined.');

            test.isNot(data.extjs, undefined, 'Framework is Ext JS');
            test.is(data.extjs, '4.2.1.883', 'Ext JS version is 4.2.1.883');
        }
    );
});