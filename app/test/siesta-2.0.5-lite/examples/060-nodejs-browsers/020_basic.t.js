StartTest(function(t) {
    
    var fooBar      = t.getFooBar();
    
    t.is(fooBar, 'foobar', 'foobar works correctly!')
})    