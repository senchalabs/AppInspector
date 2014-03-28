Ext.onReady(function () {
    
    var viewport = new Ext.Viewport({
        
        items      : [
            {
                id      : 'loginPanel',
                title   : 'Please enter your credentials',
                
                width   : 300,
                height  : 200,
                
                layout  : {
                    type    : 'vbox'
                },
                
                defaults    : {
                    labelWidth  : 100
                },
                
                items   : [
                    {
                        xtype       : 'textfield',
                        
                        fieldLabel  : 'Login'
                    },
                    
                    {
                        xtype       : 'textfield',
                        
                        fieldLabel  : 'Password'
                    }
                ],
                
                buttons : [
                    {
                        text        : 'Login',
                        
                        handler     : function () {
                            window.location.href    = "redirect_to.html"
                        }
                    }
                ]
            }  
        ]
    })
})
