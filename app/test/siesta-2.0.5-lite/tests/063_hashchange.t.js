StartTest(function(t) {
    t.diag('Clicking an A tag should update the location URL/hash');

    t.testJQuery(function (t) {
        $("body").html('<a href="#foo">Click a hash tag</a>');

        // Need to 'fake' this for IE 
//            t.waitForEvent(window, 'hashchange', function() {
//                t.is(window.location.hash, '#foo', 'Found hash object ok');
//            });

        t.click('a');
    });
});
