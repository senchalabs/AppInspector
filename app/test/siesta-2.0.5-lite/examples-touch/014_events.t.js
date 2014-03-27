StartTest(function(t) {
    t.diag('Testing events');

    Ext.Viewport.add({
        xtype: 'panel',
        html : 'Hello world...'
    });

    var bd = Ext.getBody();
    var panel = Ext.Viewport.down('panel');
            
    t.willFireNTimes(panel.element, 'doubletap', 2);
    t.willFireNTimes(panel.element, 'dragstart', 1);
    t.willFireNTimes(panel.element, 'dragend', 1);
    t.willFireNTimes(panel.element, 'longpress', 1);
            
    // Commands done programmatically...
    t.doubleTap(panel);
            
    // ...or via chainged config objects to avoid nested callbacks
    t.chain({
        action : 'doubletap',
        target : panel
    }, {
        action : 'tap',
        target : panel
    },{
        action : 'swipe',
        target : panel
    },{
        action : 'longpress',
        target : panel
    },
    function() {
        t.pass('Test ended');
    });
});
