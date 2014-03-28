StartTest(function(t) {
    
    t.requireOk('My.Store.EventStore', function () {
        
        var myStore     = new My.Store.EventStore({
        })
        
        t.is(myStore.someMethod(), 'value', 'Correctly loaded class')
        
        t.isFunction(My.Util.SomeClass, 'Correctly loaded dependency')
    })
    
})    
