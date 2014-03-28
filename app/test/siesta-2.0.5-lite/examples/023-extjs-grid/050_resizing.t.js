StartTest(function (oTest) {
    var Grid = new Ext.grid.Panel({
        width: 300,
        height: 200,
        resizable: true,
        renderTo: Ext.getBody(),
        resizeHandles: 'w e s',
        columns: [{ text: 'foo', flex : 1}],
        store: new Ext.data.Store({
            model: Ext.define('moo', { extend: "Ext.data.Model" })
        })
    });

    function getHandle(dir) {
        return Grid.el.down('.x-resizable-handle-' + dir);
    }

    // Is the grid sized appropriately?
    oTest.isDeeply(Grid.getSize(), { width : 300, height : 200 }, 'Is the grid 300x200px?');

    oTest.is(Ext.select('div.x-resizable-handle').getCount(), 3, '3 resize handles found');

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
                oTest.isDeeply(Grid.getSize(), cfg.expectedSize, 'Grid has correct width and height.');
                doDragStep();
            });
        }
    }

    oTest.waitForComponentVisible(Grid, doDragStep);
});
