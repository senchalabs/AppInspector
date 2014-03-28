StartTest(function(t) {
    //=================================================================
    t.diag("Simple grid assertions");
    
    // Use a convenience method to generate the grid, keeping the test as small as possible
    var grid = t.getGrid({
        style:'margin:20px',
        height:200,
        width : 450,
        renderTo : document.body
    });

    var view = grid.getView(),
        store = grid.store;

    t.willFireNTimes(grid, 'itemclick', store.getCount());
    var hdr = 1;

    var verifyStep = function(next, headerEl) {
        t.diag('Make sure hover classes on grid header #' + hdr++ + ' works correctly');
        t.hasCls(headerEl, 'x-column-header-over', 'Header cell has over class applied to it');
        next();
    };

    var steps = [
        // First wait until rows are present in the DOM
        { waitFor : 'compositeQuery', args : 'grid => .x-grid-cell' },
        
        function(next, cells) {
            var row = t.getFirstRow(grid);
            t.hasNotCls(row, "x-grid-row-over", 'Row does not have mouseover class by default');
            next();
        },

        { action: 'moveCursorTo', target: 'grid => .x-grid-cell' },

        function(next, cells) {
            var row = t.getFirstRow(grid);
            t.hasCls(row, "x-grid-row-over", 'Row has mouseover class');
            next();
        },

        { action : 'moveCursorTo', target : 'grid > headercontainer => .x-column-header .x-column-header-inner' },

        verifyStep,

        function(next, cells) {
            var row = t.getFirstRow(grid);
            t.hasNotCls(row, "x-grid-row-over", 'Row does not have mouseover after mouseout');

            next();
        },

        { action : 'click' },
        
        { action : 'moveCursorTo', target : 'grid > headercontainer => .x-column-header:nth-child(2) .x-column-header-inner' }, 
        verifyStep,
        { action : 'click' },
        
        { action : 'moveCursorTo', target : 'grid > headercontainer => .x-column-header:nth-child(3) .x-column-header-inner' }, 
        verifyStep,
        { action : 'click' },

        { action : 'moveCursorTo', target : 'grid > headercontainer => .x-column-header:nth-child(4) .x-column-header-inner' }, 
        verifyStep,
        { action : 'click' },

        { action : 'moveCursorTo', target : [400, 10] }, 
        
        function(next, targetEl) {
            t.is(Ext.select('.x-column-header-over').getCount(), 0, 'No header cells in hover over state');
            next();
        }
    ];

    // Let's also click all rows
    for (i = 0; i < store.getCount(); i++) {
        steps.push({ action : 'click', target : Ext.Function.bind(t.getCell, t, [grid, i, 0]) });
    }

    t.chain(steps);
});
