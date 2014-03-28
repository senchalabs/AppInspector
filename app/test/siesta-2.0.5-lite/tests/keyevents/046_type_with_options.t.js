StartTest(function(t) {

    t.testExtJS(function (t) {
        document.body.innerHTML = '<input id="txt" type="text">';

        function doAssert (e, target) {
            t.ok(e.ctrlKey, 'Ctrl key detected');
            t.ok(e.shiftKey, 'Shift key detected');
        }

        Ext.get('txt').on({
            keydown : doAssert,
            keyup   : doAssert
        })

        t.chain(
            {
                action      : 'type',
                target      : '#txt',
                text        : 'a',
                options     : { shiftKey : true, ctrlKey : true }
            }
        )
    });
});

