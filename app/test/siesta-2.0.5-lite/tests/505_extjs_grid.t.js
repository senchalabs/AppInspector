StartTest(function(t) {
    t.diag('Grid');
    
    var grid = t.getGrid();

    t.waitForRowsVisible(grid, function() {
        t.expectPass(function (t) {
            t.is(t.getFirstRow(grid).dom, Ext.select('.x-grid-row').item(0).dom, 'getFirstRow OK');
            t.matchGridCellContent(grid, 0, 0, 'Foo', 'matchGridCellContent OK');
        });
    
        t.expectFail(function (t) {
            t.matchGridCellContent(grid, 0, 0, 'ASD', 'matchGridCellContent fails OK');
        });
        
        var record  = grid.store.getAt(0)
        
        record.set('bar', '/,[,],')
        
        t.expectPass(function (t) {
            t.matchGridCellContent(grid, 0, 0, '/,[,],', 'matchGridCellContent OK');
            t.matchGridCellContent(grid, 0, 0, /\/,\[,\],/, 'matchGridCellContent OK');
        });
        
        record.set('bar', 'baz/,[,],blarg')
        
        t.expectPass(function (t) {
            t.matchGridCellContent(grid, 0, 0, '/,[,],', 'matchGridCellContent OK');
            t.matchGridCellContent(grid, 0, 0, /\/,\[,\],/, 'matchGridCellContent OK');
        });
        
        
    });
});