StartTest(function(t) {
    t.diag('Hello passing world');
    t.pass('foo');
    
    t.waitFor(100)
});