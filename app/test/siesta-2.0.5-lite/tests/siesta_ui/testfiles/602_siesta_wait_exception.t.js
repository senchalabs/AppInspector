StartTest(function(t) {
    t.it('Should finalize waits after test is done or crashed', function(t) {
        t.waitFor(400, function() {});

        throw 'Oops';
    })
});