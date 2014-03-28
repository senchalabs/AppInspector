StartTest(function (oTest) {
    var win = new Ext.Window({
        width: 300,
        height: 200,
        resizable: true,
        resizeHandles: 'w e s'
    });

    win.show();

    function getHandle(dir) {
        return win.el.down('.x-resizable-handle-' + dir);
    }

    // Is the grid sized appropriately?
    oTest.isDeeply(win.getSize(), { width : 300, height : 200 }, 'Is the grid 300x200px?');

    oTest.is(Ext.select('.x-resizable-handle').getCount(), 3, '3 resize handles found');

    var dragSteps = [
        { handle : 'east', deltaX : 50, deltaY : 0, expectedSize : { width : 350, height : 200 } },
        { handle : 'east', deltaX : -50, deltaY : 0, expectedSize : { width : 300, height : 200 } },
        { handle : 'east', deltaX : -50, deltaY : 0, expectedSize : { width : 250, height : 200 } },
        { handle : 'south', deltaX : 0, deltaY : 50, expectedSize : { width : 250, height : 250 } },
        { handle : 'south', deltaX : 0, deltaY : -50, expectedSize : { width : 250, height : 200 } },
        { handle : 'south', deltaX : 0, deltaY : -50, expectedSize : { width : 250, height : 150 } }
    ];

    function doDragStep() {
        
        var cfg = dragSteps.shift();
        if (cfg) {
            oTest.drag(getHandle(cfg.handle), null, [cfg.deltaX, cfg.deltaY], function() {
                oTest.isDeeply(win.getSize(), cfg.expectedSize, 'Grid has correct width and height.');
                doDragStep();
            });
        }
    }

    oTest.waitForComponentVisible(win, doDragStep);
});
