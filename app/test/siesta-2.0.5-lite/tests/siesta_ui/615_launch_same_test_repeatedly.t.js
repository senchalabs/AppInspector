StartTest(function (t) {
    // in this test we are going to re-start the test at different points of its life cycle
    // in any case it should not crash
    
    t.it('Should not crash if re-starting a test while it is running', function (t) {
        var Harness = t.getHarness(
            { viewDOM : true },
            [ 'testfiles/long_running.t.js' ]
        );

        t.chain(
            { waitFor : 'HarnessReady' },

            function (next) {
                t.diag('beforeteststart')
          
                Harness.on('beforeteststart', next, null, { single : true }) 
                
                t.runFirstTest(function () {});
            },
            function (next) {
                t.runFirstTest(next)
            },
            
            function (next) {
                t.diag('afterscopepreload')
                
                Harness.on('afterscopepreload', next, null, { single : true }) 
                
                t.runFirstTest(function () {});
            },
            function (next) {
                t.runFirstTest(next)
            },

            function (next) {
                t.diag('testsuitelaunch')
                
                Harness.on('testsuitelaunch', next, null, { single : true }) 
                
                t.runFirstTest(function () {});
            },
            function (next) {
                t.runFirstTest(next)
            },
            
            
            function (next) {
                t.diag('testsuitestart')
                
                Harness.on('testsuitestart', next, null, { single : true }) 
                
                t.runFirstTest(function () {});
            },
            function (next) {
                t.runFirstTest(next)
            },
            // empty last step to make the previous step async
            function (next) {
            }
        );
    })
});