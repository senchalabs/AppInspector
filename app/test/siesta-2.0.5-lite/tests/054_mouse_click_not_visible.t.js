StartTest(function(topTest) {
    
    topTest.testExtJS({
        doNotTranslate : true
    },function (t) {

        Ext.getBody().appendChild(Ext.DomHelper.createDom({
            id          : 'test',
            style       : 'display:none',
            text        : 'some content'
        }))

        t.chain(
            {
                action      : 'click',
                target      : '#test'
            }
        )
    }, function (test) {
        topTest.is(test.getAssertionCount(), 1, "One result was added to test, when clicking on not visible element")
        
        topTest.notok(test.results.itemAt(0).isPassed(), "And this result is a failing assertion")
    });
});

