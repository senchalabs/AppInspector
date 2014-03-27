StartTest(function (t) {
    var Harness = t.getHarness(
        { viewDOM : false, transparentEx : false },
        [ 'testfiles/603_test_statuses.t.js' ]
    );

    t.chain(
        { waitFor : 'HarnessReady' },

        function (next) {
            t.runFirstTest();
        }
    );
});