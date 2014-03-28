StartTest(function(t) {
    t.chain(
        { waitFor : 'CQ', args : 'gridpanel' },

        function(next, grids) {
            var userGrid = grids[0];

            t.willFireNTimes(userGrid.store, 'write', 1);
            next();
        },

        { waitFor : 'rowsVisible', args : 'gridpanel' },

        { action : 'doubleclick', target : 'gridpanel => .x-grid-cell' },

        // waiting for popup window to appear
        { waitFor : 'CQ', args : 'useredit' },

        // When using target, >> specifies a Component Query
        { action : 'click', target : '>>field[name=firstname]'},

        function(next) {
            // Manually clear text field
            t.cq1('field[name=firstname]').setValue();
            next();
        },

        { action : 'type', target : '>>field[name=firstname]', text : 'foo' },

        { action : 'click', target : '>>useredit button[text=Save]'},

        function(next) {
            t.matchGridCellContent(t.cq1('gridpanel'), 0, 0, 'foo Spencer', 'Updated name found in grid');
        }
    );
})    
