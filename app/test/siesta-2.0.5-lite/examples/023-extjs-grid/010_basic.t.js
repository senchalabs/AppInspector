StartTest(function(t) {
    //=================================================================
    t.diag("Simple grid assertions");
    
    Ext.define('Gamer', {
        extend : 'Ext.data.Model',
        fields: [
           {name: 'name'},
           {name: 'highscore', type: 'int'},
           {name: 'place', type: 'int'},
           {name: 'lastgame', type: 'date', dateFormat: 'Y-m-d'}
        ]
    });
    var store = Ext.create('Ext.data.ArrayStore', {
        model : 'Gamer',
        data: [
            ['Mike Anderson', 10, 20, '2010-11-12']     // Just some dummy inline data
        ]
    });

    // create the Grid
    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        columnLines : true,
        columns: [
            { text : 'Name', flex     : 1, sortable : false, dataIndex: 'name' },
            { text : 'Highscore', width    : 75, sortable : true, dataIndex: 'highscore' },
            { text : 'Rank', width    : 75, sortable : true, dataIndex: 'place' },
            { text : 'Last game', width    : 85, sortable : true, renderer : Ext.util.Format.dateRenderer('Y/m/d'), dataIndex: 'lastgame' }
        ],
        height: 150,
        width: 400,
        title: 'Basic Grid',
        renderTo: Ext.getBody()
    });
    
    // First wait until rows are present in the DOM
    t.waitForRowsVisible(grid, function() {
        
        // Sanity check for the row
        t.ok(grid.getView().getNode(0), "One row was found in the grid");

        // Test that the date renderer did its job
        t.matchGridCellContent(
            grid,                           // Grid to test
            0,                              // Row index
            3,                              // Column index
            '2010/11/12',                   // Text to match
            'Date correctly formatted'      // Assertion message
        );
    });
});
