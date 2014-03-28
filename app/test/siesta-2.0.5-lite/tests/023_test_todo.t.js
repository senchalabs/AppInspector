StartTest(function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Siesta.Test creation")
    
    t.testGeneric(
        {
            doNotTranslate : true
        }, 
        function (t) {
            t.pass('pass in outer test')
            
            t.todo(function (todo) {
                todo.pass('bonus pass')
                todo.fail('ok fail')
                
                todo.done()
            })
            
        }, 
        function (test) {
            t.ok(test.isPassed(), 'Outer test passes even that inner `todo` test contains a failure')
            
            t.is(test.getPassCount(true), 2, "There's 1 passing assertion in inner and 1 in outer tests")
            t.is(test.getFailCount(true), 1, "There's 1 failing assertion in inner todo tests")
            
            t.is(test.getTodoFailCount(), 1, "There's 1 failing assertion in inner todo tests")
        }
    )
})