StartTest(function(t) {
    
    var win = new Ext.Window({
        height : 200,
        width : 200,
        // Set window position to known state
        x     : 10,      
        y     : 10
    });
    
    win.show();

    t.ok(win.rendered, 'The window is rendered');
    
    t.hasSize(win, 200, 200, 'Correct initial size');

    t.drag(win.header, null, [20, 20], function() {
        
        t.drag(win.getEl().down('.x-resizable-handle-east'), null, [20, 0], function() {
            t.hasSize(win, 220, 200, 'Size increased');
            
            t.click(win.getEl().child('.x-tool-close'));
        
            t.notOk(win.el.dom, 'The dom element of the window is gone');
        });
    });
});