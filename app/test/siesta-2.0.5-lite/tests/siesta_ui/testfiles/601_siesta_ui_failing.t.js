StartTest(function(t) {
    // Some comment
    t.diag('Hey from inner world');
    t.fail('foo');  // Line 4
});