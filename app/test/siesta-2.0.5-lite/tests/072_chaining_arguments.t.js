StartTest(function(t) {
    
    t.testExtJS(function (t) {
        // frame : false is required as of ExtJS 4.2.0
        var btn = new Ext.button.Button({ text : 'text', id : 'bar', cls : 'foo', renderTo : Ext.getBody(), frame : false });
        
        t.chain(
            {
                action  : 'click',
                target  : '>>button[cls=foo]'
            },
            function (next, previousTarget) {
                t.is(previousTarget, btn, 'Button reference was passed to next fn');
                next();
            },
            {
                action  : 'click',
                target  : btn
            },
            function (next, previousTarget) {
                t.is(previousTarget, btn, 'Button reference was passed to next fn');
                next();
            },
            {
                action  : 'click',
                target  : [50,50]
            },
            function (next, previousTarget) {
                t.is(previousTarget, document.body, 'BODY el reference was passed to next fn');
                next();
            },
            {
                action  : 'click',
                target  : '.foo' 
            },
            function (next, previousTarget) {
                t.is(previousTarget, btn.el.dom, 'button el reference was passed to next fn');
                next();
            },
            {
                action  : 'click',
                target  : function() { return '#bar'; }
            },
            function (next, previousTarget) {
                t.is(previousTarget, btn.el.dom, 'Button element was passed to next fn');
            }
            
        )
    });
});
