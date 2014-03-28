StartTest(function(t) {
    
    t.diag('Requiring the singleton class');
    t.expectGlobals('MyApp');

    t.testExtJS(function (t) {

        Ext.Loader.setConfig({
            enabled             : true, 
            disableCaching      : false 
        });
        
        Ext.Loader.setPath('MyApp', 'data')
       
        t.requireOk('MyApp.Normal', 'MyApp.Singleton', function () {
        });
    });    
});