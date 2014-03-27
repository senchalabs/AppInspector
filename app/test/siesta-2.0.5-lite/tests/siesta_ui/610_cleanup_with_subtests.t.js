StartTest(function(t) {
    t.getHarness(
        { 
            autoRun             : false, 
            viewDOM             : true,
            // cleanup immediately
            keepNLastResults    : 0,
            keepResults         : false
        }, 
        [
            {
                forceDOMVisible     : true,
                url                 : 'testfiles/610_cleanup_with_subtests.t.js'
            }
        ]
    );

    t.chain(
        { waitFor : 'rowsVisible', args : 'testgrid' },
        
        function (next) {
            Harness.on('testfinalize', next, null, { single : true, delay : 5000 })
            
            t.doubleClick('testgrid => .x-grid-row', function () {})
        },
        function (next, event, test) {
            test.eachSubTest(function (subTest) {
                t.notOk(subTest.global, "Global is cleaned up")
                t.notOk(subTest.run, "`run` is cleaned up")
                t.notOk(subTest.originalSetTimeout, "`originalSetTimeout` is cleaned up")
                t.notOk(subTest.originalClearTimeout, "`originalClearTimeout` is cleaned up")
            })
        }
    );
});
