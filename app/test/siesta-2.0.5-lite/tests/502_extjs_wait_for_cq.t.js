StartTest(function(t) {
    
    var viewport, panel, button, toolbar
    
    t.testExtJS(function (t) {
        
        viewport            = new Ext.Viewport({
            
            items   : [
                {
                    xtype       : 'panel'
                }
            ]
        })
        
        panel               = viewport.items.getAt(0)
        
        
        t.waitForComponentQuery('button', function (res) {
            t.pass('Found the button via global query')
        })
        
        t.waitForComponentQuery('button', panel, function () {
            t.pass('Found the button via query with root')
        })
        
        t.waitForComponentQuery('button', viewport, function () {
            t.pass('Found the button via query with root')
        })

        toolbar              = new Ext.Toolbar({
            id    : "foo"
        })
        panel.add(toolbar)

        t.waitForComponentQueryNotVisible('#foo', viewport, function () {
            t.pass('Detected non-visible button');
        });

        toolbar.hide();

        button              = new Ext.Button({
            text    : "Oh hai"
        })
        
        panel.add(button)
        
    }, function () {
        
        t.testExtJS(function (t) {
            // Destroyed instances are still found by the ComponentQuery - revisit in 4.1
            
//            t.waitForComponentQueryNotFound('button', function (res) {
//                t.pass('Button was removed')
//            })
            
            t.waitForComponentQueryNotFound('button', panel, function () {
                t.pass('Button was removed')
            })
            
            t.waitForComponentQueryNotFound('button', viewport, function () {
                t.pass('Button was removed')
            })
            
            panel.remove(button)
        }, function () {
            
            var addedLoginButton        = false
            
            panel.add({
                xtype   : 'button',
                text    : 'Oh hai'
            })
            
            setTimeout(function () {
                panel.add({
                    xtype   : 'button',
                    text    : 'Login'
                })
                
                addedLoginButton = true
                
            }, 10)
            
            t.testExtJS(function (t) {
                t.waitForComponentQueryVisible('button', viewport, function () {
                    t.pass('Found first button')
                    
                    t.notOk(addedLoginButton, "Login button was not added yet")
                })
                
                t.waitForComponentQueryVisible('button[text="Login"]', viewport, function (res) {
                    t.is(res.length, 1, 'There are now 2 buttons in the panel')
                    
                    t.pass('Found login button')
                })
            })
            
        })
    })
    
});