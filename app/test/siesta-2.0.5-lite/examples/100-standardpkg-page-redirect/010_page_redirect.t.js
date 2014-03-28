StartTest(function(t) {
    
    // Running in the 'top' page scope. Get the local variables from the test.
    var Ext = t.Ext();
    var window = t.global;
    var document = window.document;
    
    t.chain(
        { action : "type", target : '>> #loginPanel textfield[fieldLabel=Login]', text: "CharlieJohnson" }, 
        
        { action : "type", target : '>> #loginPanel textfield[fieldLabel=Password]', text: "secret" },
        
//        in Chrome page refresh happens too fast, and "waitForPageLoad" waits indefinitely
//        need to wait first, and only then - click
        function (next) {
            t.waitForPageLoad(next)
            
            t.click('>> #loginPanel button', function () {})
        },
       
// see comment above - this code won't work in Chrome
        
//        { action : 'click', target : '>> #loginPanel button' },
//        
//        // wait for the new page to load, in the callback we'll receive the new window object as well as window.Ext 
//        { waitFor : 'pageLoad' },
        
        function (next, window, Ext) {
            var panel   = Ext.getCmp('authResult')
                
            t.is(panel.authResult, 'success', 'Correct authentication result');
            
            t.done();
        }
    )
})    