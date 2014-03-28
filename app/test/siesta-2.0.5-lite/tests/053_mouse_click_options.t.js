StartTest(function(t) {
    
    t.testExtJS(function (t) {
        function doAssert (e, target) {
            t.ok(e.ctrlKey, 'Ctrl key detected');
            t.ok(e.shiftKey, 'Shift key detected');
        }

        Ext.getBody().on({
            click       : doAssert,
            rightclick  : doAssert,
            doubleclick : doAssert
        })

        t.chain(
            {
                action      : 'click',
                target      : document.body,
                options     : { shiftKey : true, ctrlKey : true }
            },
            {
                action      : 'rightclick',
                target      : document.body,
                options     : { shiftKey : true, ctrlKey : true }
            },
            {
                action      : 'doubleclick',
                target      : document.body,
                options     : { shiftKey : true, ctrlKey : true }
            }
        )
    });
});

