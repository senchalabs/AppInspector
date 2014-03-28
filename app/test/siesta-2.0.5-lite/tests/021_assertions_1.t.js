StartTest(function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Siesta.Test creation")
    
    t.expectPass(function (t) {
        t.ok(true, 'True is ok')
        t.is(null, undefined, 'Null is undefined')
        t.is(1, "1", '1 is "1"')
        t.is(new Date(2010, 1, 1), new Date(2010, 1, 1), 't.is works for dates')
        
        t.isDeeply(new Date(2010, 1, 1), new Date(2010, 1, 1), 't.is works for dates')
        
        t.isDeeply(function () {}, function () {}, "Functions should match")
        t.isDeeply(function () { foo }, function () { foo }, "Functions should match")
        t.isDeeply(/a/, new RegExp("a"), "Regexps should match")
        t.isDeeply(/a/i, /a/i, "Regexps should match")

        t.isntStrict(2, "2")
        
        // this case is special, because in JS, 1.05 - 1 = 0.050000000000000044
        // we have special processing in isApprox
        t.isApprox(1, 1.05, "The to-fixed normalization works")
        
        t.isApprox(1e22, 1e22, "The sciene notation works")

        t.isInstanceOf(new String(), String, 'isInstanceOf pass ok');
    })
    
    t.expectFail(function (t) {
        t.ok(false, 'False is not ok')
        t.is(null, NaN, 'Null is not a NaN')
        t.is(1, 2, '1 is not a 2')
        t.isDateEqual(new Date(2010, 1, 1), new Date(2010, 1, 2), 'isDateEqual fails ok')
        
        t.isDeeply(new Date(2010, 1, 1), new Date(2010, 1, 2), 't.is works for dates')
        t.isDeeply("1,2", ["1", "2"], "Different types should fail")

        var func1   = function () {}
        var func2   = function () {}
        
        func2.prop  = true
        
        t.isDeeplyStrict(func1, func2, "Functions should match")
        t.isDeeply(/a/, /a/i, "Regexps should match")
        
        t.isStrict(2, "2")
        
        t.isApprox(1, 1.06)
        t.isApprox(1e22, 1e21, "The sciene notation works")

        t.isInstanceOf(new String(), Date, 'isInstanceOf fail ok');
    })
    
})