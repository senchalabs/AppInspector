StartTest(function(t) {
    
    //=================================================================
    t.diag("Ok assertions")
    
    t.ok(true, 'True is ok')
    t.ok(1, '1 is ok')
    t.ok({}, '{} is ok')
    
    t.notOk(false, 'false is not ok')
    t.notOk(0, '0 is not ok')
    t.notOk(undefined, '`undefined` is not ok')
    
    //=================================================================
    t.diag("Is assertions")
    
    t.is(1, 1, '1 is 1')
    t.is(1, "1", '1 is "1"')
    
    t.is(null, undefined, 'null is undefined')
    t.isnt(1, 2, "1 isn't 2")
    
    //=================================================================
    t.diag("Like assertions")
    
    t.like('Yo', /yo/i, '"Yo" is like "yo"')
    t.like('Yoda', 'Yo', '"Yoda" contains "Yo"')
    
    //=================================================================
    t.diag("Throws / lives assertions")
    
    t.throwsOk(function () {
        throw "yo"
    }, /yo/, 'Exception thrown, and its "yo"')
    
    t.livesOk(function () { 
        var a = 1
    }, 'Exception not thrown')
    
    //=================================================================
    t.diag("isDeeply assertions")
    
    t.isDeeply({ a : 1, b : 2 }, { a : '1', b : 2 }, 'Correct')
    t.isDeeply({ a : 1, b : 2 }, { a : 1, b : 2 }, 'Correct')

    
    //=================================================================
    t.diag("Examples of failed assertions")

    // wrapped with "todo" to prevent the test to fail
    t.todo("examples of the failed assertions", function (t) {
        t.ok(0, '0 is not ok')
        t.ok('', 'Empty string is not ok')
        
        t.is({}, {}, '{} is not {}')
        t.isnt(1, 1, "1 is 1")
        t.isStrict(null, undefined, 'Null is (==) undefined')
        t.isntStrict(null, null, 'Null is === null')
        
        t.like('Yo', /foo/i, '"Yoda" doesn\'t match /foo/i')
        t.unlike('Yo', /yo/i, '"Yo" match "yo"')
        t.unlike('Yoda', 'Yo', '"Yoda" contains "Yo"')
        
        
        t.throwsOk(function () { 
            throw "yo" 
        }, /foo/, 'Exception thrown, but its not "foo"')
        
        t.livesOk(function () { 
            throw "yo" 
        }, 'Exception not thrown')
        
        t.isDeeply({ a : 1, b : 2 }, [ { c: 3 } ], 'JSON structures are different')
        
        t.isDeeplyStrict({ a : 1, b : 2 }, { a : '1', b : 2 }, '`isDeeplyStrict` requires exact match (===)')
    })
})    
