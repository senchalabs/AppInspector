StartTest(function(t) {
    
    var win = new Ext.Window({
        foo     : 'bar',
        height  : 200,
        width   : 200,
        x       : 10,
        y       : 10
    });
    
    win.show();

    t.describe('Ext.Window Tests', function(t) {

        t.it("Should have correct size and position", function (t) {
            t.ok(win.rendered, 'The window is rendered');
            t.hasSize(win, 200, 200, 'Correct initial size');
        });

        t.it("Should be draggable", function (t) {

            t.chain(
                { action : 'drag', target : win.down('header'), by : [20, 20] },

                function() {
                    t.hasPosition(win, 30, 30);
                }
            );
        });

        t.it("Should be resizable", function (t) {
            t.chain(
                { action : 'drag', target : 'window[foo] => .x-resizable-handle-east', by : [20, 0] },

                function() {
                    t.hasSize(win, 220, 200, 'Size increased');
                }
            );
        });

        t.it("Should be closable", function (t) {
            t.chain(
                { action : 'click', target : '>> tool[type=close]' },

                function() {
                    t.notOk(win.el, 'The dom element of the window is gone');
                }
            );
        });
    })
});