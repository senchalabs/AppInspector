StartTest(function(t) {
    
    t.is(1, 1, 'Correct')
    t.isnt(1, 2, 'Correct')
    t.ok(1, 'Correct')
    t.notOk(0, 'Correct')
    
    t.isStrict(null, null, 'Correct')
    
    t.like('Yo', /yo/i, 'Correct')

    t.throwsOk(function () { throw "yo" }, /yo/, 'Exception thrown')
    t.livesOk(function () { }, 'Exception not thrown')
    
    t.isDeeplyStrict({ a : 1, b : 2 }, { a : 1, b : 2 }, 'Correct')
})    
