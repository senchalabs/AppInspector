StartTest(function(t) {
    // Simple visual inspection test to assert correct icons are shown
    t.pass('PASS');
    t.fail('WAIT');

    t.todo('TODO', function(t){
        t.pass('TODO PASS')
        t.fail('TODO FAIL')
    })

    t.it('Pass subtest', function(t){
        t.pass('SUB PASS')
    })

    t.it('Fail subtest', function(t){
        t.fail('SUB FAIL')
    })

    t.diag('DIAG');

    t.waitFor(100, function() {}, null, 1000);
    t.waitFor(10000);
    t.waitFor(function() {}, function() {}, null, 1000);
});