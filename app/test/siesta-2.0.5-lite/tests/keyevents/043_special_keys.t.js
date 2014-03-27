StartTest(function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Siesta.Test keyboard simulation");
    
    t.testExtJS(function (t) {
        var keys = "[TAB]",
            box = new Ext.form.TextField({
                enableKeyEvents : true,
                renderTo : Ext.getBody()
            });
        
        t.willFireNTimes(box, 'specialkey', 1);
        box.on('specialkey', function(field, e) {
            t.is(e.getKey(), e.TAB, 'TAB simulated ok');
        });
        box.focus();
        t.type(box, "[TAB]", function() {
            box.destroy();
        });
    });
});
