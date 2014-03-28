StartTest(function(t) {
    
    //=================================================================
    t.diag("Testing asynchronous code")
    
    // this function performs an asynchronous addition of 1st argument to second
    var asynchronousFunction = function (a, b, callback, errback) {
        
        setTimeout(function () {
            
            var res = a + b
            
            if (isNaN(res)) {
                errback(res)
            } else {
                callback(res)
            }
            
        }, 100)
    };
    
    // optional when using `setTimeout`, but required for XHR requests
    var async1   = t.beginAsync()
    
    asynchronousFunction(1, 1, function (res) {
        
        t.is(res, 2, 'Correct result of 1 plus 1')
        
        // optional when using `setTimeout`, but required for XHR requests
        t.endAsync(async1)
        
        next()
        
    }, function () {
        t.fail("Should never get here")
    })
    
    
    var next = function () {
        
        // optional when using `setTimeout`, but required for XHR requests
        var async2   = t.beginAsync()
        
        asynchronousFunction(1, {}, function () {
            
            t.fail("Should never get here")
            
        }, function (res) {
            t.ok(isNaN(res), '1 plus {} is not a number')
            
            // optional when using `setTimeout`, but required for XHR requests
            t.endAsync(async2)
        })
    }
    
})    