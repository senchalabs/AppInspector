StartTest(function(t) {
	//==================================================================================================================================================================================
    t.diag("Siesta.Test.More methods")
    
    var topTest     = t

    //==================================================================================================================================================================================
    t.diag("WaitFor")
    
    t.testGeneric(
        {
            doNotTranslate : true
        }, 
        function (t) {
            var counter     = 0 
            
            t.waitFor(
                function () {
                    return counter++ > 2
                }, 
                function () {
                    
                    t.waitFor(
                        function () {
                        }, 
                        function () {
                            topTest.fail("Should never reach this")
                        },
                        null,
                        200
                    )
                }
            )
        }, 
        function (test) {
            t.is(test.getAssertionCount(), 2, '2 assertions - 1 for passed waitFor and 1 for failed')
            t.ok(test.results.itemAt(0).passed, "1st one is passing")
            t.notOk(test.results.itemAt(1).passed, "2nd one is failing")
        }
    )

    t.testGeneric(
        {
            doNotTranslate : true
        }, 
        function (t) {
            t.waitFor(
                function () {
                    throw 'wtf';
                }, 
                function () {
                    topTest.fail("Should never get here")
                },
                null,
                200
            )
        }, 
        function (test) {
            t.is(test.getAssertionCount(), 1, 'A failing assertion was added - exception was detected')
            t.notOk(test.results.itemAt(0).passed)
        }
    )
    
    t.testGeneric(
        {
            doNotTranslate : true
        }, 
        function (t) {
            var waiter   = t.waitFor(
                function () {
                }, 
                function () {
                    t.pass("Reached callback")
                },
                null,
                200
            )
            
            waiter.force()
        }, 
        function (test) {
            t.is(test.getAssertionCount(), 2, 'An assertion was added - for wait for')
            t.ok(test.results.itemAt(0).passed, "and its passed because of force")
            t.ok(test.results.itemAt(0).isWaitFor, "and its passed because of force")
            t.ok(test.results.itemAt(1).passed, "Reached callback")
        }
    )    
    
})
