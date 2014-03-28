StartTest(function(t) {
    t.diag('#waitForEvent');
    
    t.testJQuery(function (t) {

        // relevant for IE8 only (and probably below)
        var keysPropagationTarget       = Ext.isIE ? document.body : window
        
        t.willFireNTimes(keysPropagationTarget, 'keydown', 1);
        t.chain(
            function(next) { 
                t.setTimeout(function() { 
                    t.moveMouseTo([40, 40], function() {}); 
                }, 300);
                 
                next();
            },

            { waitFor : 'event', args : [document.body, 'mousemove'] },

            function(next) { 
                t.setTimeout(function() { 
                   t.type(document.body, 'a');
                }, 300)
                 
                next();
            },

            { waitFor : 'event', args : [keysPropagationTarget, 'keydown'] }
        );
    });
});
