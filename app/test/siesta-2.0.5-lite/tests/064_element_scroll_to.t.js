StartTest(function(t) {
    
    t.testBrowser(function (t) {
        t.$('body').html('<div id="outer" style="overflow:scroll;position:absolute;height:200px;width:200px"><div style="position:absolute;height:400px;width:400px"></div></div>');
        
        var outer   = document.getElementById('outer')
        
        var maxScrollTop        
        
        t.chain(
            function (next) {
                var newScrollTop    = t.scrollVerticallyTo(outer, 100, next)
                
                t.is(newScrollTop, 100, "Correct new scroll top")
            },
            function (next) {
                t.is(outer.scrollTop, 100, "Correct new scroll top")
                
                // scrolling maximum to the bottom
                t.scrollVerticallyTo(outer, 500, next)
            },
            function (next) {
                // saving the max scroll top position
                maxScrollTop        = outer.scrollTop
                
                // scrolling even further to the bottom should also successed 
                // (event that scroll position won't change and event won't be fired)
                var newScrollTop    = t.scrollVerticallyTo(outer, 1500, next)
                
                // but the scroll position will be the same
                t.is(newScrollTop, maxScrollTop, "Correct new scroll top")
            },
            function (next) {
                // but the scroll position will be the same
                t.is(outer.scrollTop, maxScrollTop, "Correct new scroll top")
            }
        )
    });
});
