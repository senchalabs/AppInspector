StartTest(function(t) {
    // this test will auto log in, using the `setup` method of the test class

    t.chain(
        function(next) {
            t.ok(t.cq1('contacts'), 'Should find a contacts view');
        }
    );
});
