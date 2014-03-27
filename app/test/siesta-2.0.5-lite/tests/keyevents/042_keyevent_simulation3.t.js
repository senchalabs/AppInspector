StartTest(function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Siesta.Test keyboard simulation");
    
    t.testExtJS(function (t) {
        var keys = ",;.-'",
            box = new Ext.form.TextField({
                width               : 400,
                enableKeyEvents     : true,
                emptyText           : 'foobar',
                renderTo            : Ext.getBody()
            });
        
        t.willFireNTimes(box, 'keydown', keys.length, '"keydown" was fired for each character');
        t.willFireNTimes(box, 'keypress', keys.length, '"keypress" was fired for each character');
        t.willFireNTimes(box, 'keyup', keys.length, '"keyup" was fired for each character');
        
        box.setReadOnly(true);
        
        t.chain(
            {
                action      : 'type',
                target      : box,
                text        : "a"
            },
            function (next) {
                t.isFieldEmpty(box, 'No value => readOnly');
                
                box.setReadOnly(false);
                box.setDisabled(true);
                
                next()
            },
            {
                action      : 'type',
                target      : box,
                text        : "b"
            },
            function (next) {
                t.isFieldEmpty(box, 'No value => disabled');
                box.setDisabled(false);
                
                next()
            },
            {
                action      : 'type',
                target      : box,
                text        : keys
            },
            function (next) {
                t.is(box.getValue(), keys, "Correctly simulated keys");
            }
        )
    });
});
