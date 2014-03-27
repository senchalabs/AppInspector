StartTest(function(t) {
    //=================================================================
    t.diag("Simple grid assertions");
    
    // Use a convenience method to generate the grid, keeping the test as small as possible
    var grid = t.getGrid({
        plugins     : Ext.create("Ext.grid.plugin.RowEditing", {}),
        renderTo    : document.body
    });
     
    var store                   = grid.store;
    var foundEl     
    
    t.chain(
        { waitFor : 'rowsVisible', args : grid }, 
        
        { action  : 'doubleClick', target  : 'grid => .x-grid-cell' },
        
        { waitFor : 'selectorAtCursor', args: 'input' },

        function (next, el) {
            foundEl         = el
            
            // Clear text field
            foundEl.value   = '';
            
            next()
        },

        { action      : 'type', target      : function () { return foundEl; }, text        : 'foo' },

        // generally this "wait" is not required we just want to find the top-most element from the 
        // center point of the cell with date

        { action  : 'click', target  : '>> roweditor datefield' },

        function (next, el) {
            t.cq1('roweditor datefield').setValue();

            next()
        },

        { action      : 'type', text        : '01/18/2009[ENTER]' },
        
        // Verify step
        function () {
            t.is(store.first().get('name'), 'foo', 'Name was updated correctly');
            t.isDateEqual(store.first().get('lastgame'), new Date(2009, 0, 18), 'Date was updated correctly');
        }
    )
});
