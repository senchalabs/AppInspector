StartTest(function (t) {
    // in this test we are going to re-start the test at different points of its life cycle
    // in any case it should not crash
    
    t.it('Should not crash if re-starting a test while it is running', function (t) {
        var Harness = t.getHarness(
            { viewDOM : false, transparentEx : false },
            [ 'testfiles/602_siesta_wait_exception.t.js' ]
        );

        t.chain(
            { waitFor : 'HarnessReady' },

            function (next) {
                t.waitForHarnessEvent('testsuiteend', next)
                t.selectorNotExists('.tr-waiting-row', 'All waiting rows should be finalized')
                t.runFirstTest();
            },

            function (next) {
                t.selectorExists('.tr-waiting-row-failed', 'All waiting rows should be finalized')
            }
        );
    })
});