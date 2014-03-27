Ext.onReady(function () {
    
    var viewport = new Ext.Viewport({
        layout      : 'fit',
        
        items      : [
            {
                id              : 'authResult',
                title           : 'Welcome to authenticated zone',
                
                authResult      : 'success'
            }  
        ]
    })
})
