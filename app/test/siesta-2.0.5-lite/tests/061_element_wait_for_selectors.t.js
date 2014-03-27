StartTest(function(t) {
    
    t.testJQuery(function (t) {
        t.diag('#waitForSelectors');

        var div1        = document.createElement('div')
        div1.className  = 'div1'
        
        var div2        = document.createElement('div')
        div2.className  = 'div2'
        
        var div3        = document.createElement('div')
        div3.className  = 'div3'
        
        setTimeout(function () {
            document.body.appendChild(div1)
        }, 100)
        
        setTimeout(function () {
            document.body.appendChild(div2)
        }, 300)
        
        setTimeout(function () {
            document.body.appendChild(div3)
        }, 500)
        
        t.waitForSelectors([ '.div1', 'div.div2', 'body > div.div3' ], function() {
            t.pass('waitForSelectors did its job');
        });
    });
});
