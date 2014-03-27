describe("myName", function (t) {
    
    t.testGeneric(
        {
            doNotTranslate : false
        }, 
        function (t) {
            t.ok(t.any(Number).equalsTo(1), 'Placeholder matches number')
            t.ok(t.any(Number).equalsTo(new Number(10)), 'Placeholder matches number')
            t.ok(t.any(Number).equalsTo(Number(10)), 'Placeholder matches number')
            t.ok(t.any(Number).equalsTo(t.any(Number)), 'Placeholder matches itself')
            
            t.notOk(t.any(Number).equalsTo(''), 'Number does not match string')
            t.notOk(t.any(Number).equalsTo({}), 'Number does not match object')
            t.notOk(t.any(Number).equalsTo(/ /), 'Number does not match RegExp')
            
            t.ok(t.any(String).equalsTo(''), 'Placeholder matches string')
            t.ok(t.any(String).equalsTo(new String('')), 'Placeholder matches string')
            t.ok(t.any(String).equalsTo(String('')), 'Placeholder matches string')
            
            t.ok(t.any(Date).equalsTo(new Date()), 'Placeholder matches date')
            
            t.ok(t.any(Array).equalsTo([]), 'Placeholder matches array')
            
            t.ok(t.any(Boolean).equalsTo(true), 'Placeholder matches boolean')
            
            t.ok(t.any(RegExp).equalsTo(/ /), 'Placeholder matches reg exp')
            
            t.ok(t.any(Object).equalsTo(/ /), 'Placeholder matches reg exp')
            
            t.ok(t.any(Object).equalsTo(t), 'Object placeholder matches test instance')
            t.ok(t.any(Siesta.Test).equalsTo(t), 'Siesta.Test placeholder matches test instance')
            
            t.ok(t.any(RegExp).equalsTo(t.any(Object)), 'Any RegExp is an Object')
            t.ok(t.any(Function).equalsTo(t.any(Object)), 'Any Function is an Object')
            t.notok(t.any(Number).equalsTo(t.any(Object)), 'Any Number is not necessary an Object')
            
            t.ok(t.compareObjects(1, 1, false, true))
            t.ok(t.compareObjects(1, t.any(Number), false, true))
            t.ok(t.compareObjects(t.any(Object), {}, false, true))
            
            t.is(1, t.any(Number), 't.is works with placeholders correctly')
            t.is("1", t.any(String), 't.is works with placeholders correctly')
            t.is({}, t.any(Object), 't.is works with placeholders correctly')
            t.is(t.any(Object), {}, 't.is works with placeholders correctly')
            
            t.is(1, t.any(), 'Empty `t.any()` matches anything')
            t.is({}, t.any(), 'Empty `t.any()` matches anything')
            t.is([], t.any(), 'Empty `t.any()` matches anything')
            
            t.isDeeply({ name : "quix" }, { name : t.any(String) }, "isDeeply works with placeholders" )
            
            t.isDeeply(
                { name : "quix", age : 11, children : [ {} ] }, 
                { name : t.any(String), age : t.any(Number), children : t.any(Array) }, 
                "isDeeply works with placeholders" 
            )
        }, 
        function (test) {
        }
    )    
    
})    
