StartTest(function(t) {
    //=================================================================
    t.diag("Simple grid assertions");
    
    // Use a convenience method to generate the grid, keeping the test as small as possible
    var grid = t.getGrid({
        plugins : Ext.create("Ext.grid.plugin.CellEditing", {}),
        renderTo : document.body
    });
     
    var store = grid.store;

    t.chain(
        { waitFor : 'rowsVisible', args : grid }, 
        
        // See if we can edit the name cell
        { action : 'moveCursorTo', target : 'grid => .x-grid-cell' },
        
        { waitFor : 1000 },

        { action : 'doubleClick', target : 'grid => .x-grid-cell' },
        
        function(next, cell) {
            var prevValue       = store.first().get('name');
            next()  // continue the chain
        },

            // Wait for editor to appear at the position of the cell
        { waitFor : 'selectorAtCursor', args : 'input' }, 
        
        function(next, foundEl) { 
            // Clear text field
            foundEl.value = '';

            // Type some text
            t.type(foundEl, 'foo[ENTER]', next);
        },
        
        function async(next) {
            t.is(store.first().get('name'), 'foo', 'Name was updated correctly');
            next();
        },
        
        // See if we can edit the "last game" cell
        { action : 'doubleClick', target : 'grid => .x-grid-cell:nth-child(4)' },
            
        // Date value is "11/12/2010", change to "01/12/2010"
        { waitFor : 'selectorAtCursor', args : 'input' },

        function(next, foundEl) {
            foundEl.value = '';
            next();
        },

        { action : 'type', text : '01/18/2009[ENTER]' }, 
        
        function() {
            t.isDateEqual(store.first().get('lastgame'), new Date(2009, 0, 18), 'Date was updated correctly');
        }
    );
    // eof waitForRowsVisible
});
