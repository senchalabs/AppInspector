StartTest(function(t) {
    
    t.testExtJS(function (t) {
        
        var evalAction      = new Siesta.Test.Action.Eval({
            // required attributes
            test        : true,
            next        : true
        })
        
        t.isDeeply(evalAction.parseActionString('t.waitForComponent("com\\"bo")'), {
            methodName      : 'waitForComponent',
            params          : [ 'com"bo' ]
        }, 'Correctly parsed eval action')
        
        t.isDeeply(evalAction.parseActionString('click([ 1, 1 ])'), {
            methodName      : 'click',
            params          : [ [ 1, 1 ] ]
        }, 'Correctly parsed eval action')
        
        t.isDeeply(evalAction.parseActionString('click(1, "1", 2, { "3" : 5 }, [ 8 ])'), {
            methodName      : 'click',
            params          : [ 1, "1", 2, { "3" : 5 }, [ 8 ] ]
        }, 'Correctly parsed eval action')
        
        t.isDeeply(evalAction.parseActionString('t.waitForComponent combo'), {
            error           : 'Wrong format of the action string: t.waitForComponent combo'
        }, 'Correctly detected erroneous string')
        
        t.isDeeply(evalAction.parseActionString('t.waitForComponent(combo)'), {
            error           : "Can't parse arguments: combo"
        }, 'Correctly detected erroneous string')
        
        var btn = new Ext.Button({ 
            id : 'bar', 
            renderTo : Ext.getBody() 
        });
        
        t.willFireNTimes(btn, 'click', 1, 'Clicking using plain string should work')
        
        setTimeout(function () {
            
            var div = document.createElement('div')
            div.className   = "foo"
            
            document.body.appendChild(div)
            
        }, 300)
        
        t.chain(
            'click("#bar")',
            'waitForSelector("div.foo")'
        )
    });
});
