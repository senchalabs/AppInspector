StartTest(function(t) {
    
    t.diag("Sanity")
    
    t.ok(Ext, 'ExtJS is here')
    t.ok(Ext.Window, '.. indeed')
    
    
    throw "Going to fire the 'testfailedwithexception' event"
})    
