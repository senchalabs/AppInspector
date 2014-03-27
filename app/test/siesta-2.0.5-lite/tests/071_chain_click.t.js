StartTest(function(t) {
    
    var setup = function () {
        var button1Clicked      = false
        var button2Clicked      = false
        var button3Clicked      = false
        
        return new Ext.Viewport({
            
            items   : [
                {
                    xtype       : 'button',
                    
                    handler     : function () {
                        t.notOk(button1Clicked, 'button1 is not yet clicked')
                        t.notOk(button2Clicked, 'button2 is not yet clicked')
                        t.notOk(button3Clicked, 'button3 is not yet clicked')
                        
                        button1Clicked = true
                    }
                },
                {
                    xtype       : 'button',
                    
                    handler     : function () {
                        t.ok(button1Clicked, 'button1 is clicked')
                        t.notOk(button2Clicked, 'button2 is not yet clicked')
                        t.notOk(button3Clicked, 'button3 is not yet clicked')
                        
                        button2Clicked = true
                    }
                },
                {
                    xtype       : 'button',
                    
                    handler     : function () {
                        t.ok(button1Clicked, 'button1 is clicked')
                        t.ok(button2Clicked, 'button2 is clicked')
                        t.notOk(button3Clicked, 'button3 is not yet clicked')
                        
                        button3Clicked = true
                    }
                }
            ]
        })
    }
    
    
    t.testExtJS(function (t) {

        t.chain(
            function (next) {
                var viewport = setup()
                
                t.diag('#chainClick');
                
                t.chainClick(viewport.query('button'), function () {
                    
                    next(viewport)
                })
            },
            function (next, oldViewport) {
                oldViewport.destroy()
                
                var viewport = setup()
                
                t.diag('#clickComponentQuery - with root');
                
                t.clickComponentQuery('button', viewport, function () {
                    
                    next(viewport)
                })
            },
            function (next, oldViewport) {
                oldViewport.destroy()
                
                var viewport = setup()
                
                t.diag('#clickSelector');
                
                t.clickSelector('.x-btn', viewport, function () {
                    
                    next(viewport)
                })
            }
//            ,
//            function (next, oldViewport) {
//                oldViewport.destroy()
//                
//                var viewport = setup()
//                
//                t.diag('#clickComponentQuery - w/o root');
//                
//                t.clickComponentQuery('button')
//            }
        ) 
    });
});
