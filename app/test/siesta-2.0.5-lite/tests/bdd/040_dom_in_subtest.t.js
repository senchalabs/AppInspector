StartTest(function(t) {
    
    t.testExtJS(function (t) {
    
        var win = new Ext.Window({
            foo     : 'bar',
            height  : 200,
            width   : 200,
            x       : 10,
            y       : 10
        });
        
        win.show();
    
        t.describe('Ext.Window Tests', function(t) {
    
            t.it("Should be draggable", function (t) {
    
                t.chain(
                    { action : 'drag', target : win.down('header'), by : [20, 20] },
    
                    function() {
                        t.hasPosition(win, 30, 30);
                    }
                );
            });
        })
    })
});