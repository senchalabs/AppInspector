StartTest(function(t) {
    
    t.testExtJS(function (t) {
        var buttonClicked       = false
        
        var viewport            = new Ext.Viewport({
            
            items   : [
                {
                    xtype       : 'button',
                    
                    handler     : function () {
                        buttonClicked = true
                    }
                },
                {
                    xtype       : 'textfield' 
                },
                {
                    xtype       : 'textarea' 
                }
            ]
        })
        
        t.chain(
            {
                action  : 'type',
                
                text    : 'Foo',
                target  : viewport.child('.textfield')
            },
            function (next) {
                t.is(viewport.child('.textfield').getValue(), 'Foo', 'Correct value')
                t.is(viewport.child('.textarea').getValue(), '', 'Correct value')
                t.notOk(buttonClicked, 'Button is not yet clicked')
                
                next()
            },
            {
                action  : 'type',
                
                text    : 'Bar',
                target  : viewport.child('textarea')
            }, 
            function (next) {
                t.is(viewport.child('.textfield').getValue(), 'Foo', 'Correct value')
                t.is(viewport.child('.textarea').getValue(), 'Bar', 'Correct value')
                t.notOk(buttonClicked, 'Button is not yet clicked')
                
                next()
            },
            {
                action  : 'click',
                
                target  : viewport.child('button')
            },
            function () {
                t.is(viewport.child('.textfield').getValue(), 'Foo', 'Correct value')
                t.is(viewport.child('.textarea').getValue(), 'Bar', 'Correct value')
                t.ok(buttonClicked, 'Button is clicked')
            }
        )
        
    });
});
