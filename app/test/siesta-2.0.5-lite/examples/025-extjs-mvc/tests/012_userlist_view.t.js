StartTest(function(t) {
    t.requireOk(
        [
         'AM.model.User', 
         'AM.store.Users', 
         'AM.view.user.List'
         ], 
        function() {
            var grid = Ext.create('AM.view.user.List', {
                renderTo : Ext.getBody(),
                store : new AM.store.Users(),
                height : 200,
                width : 300
            });

            t.waitForRowsVisible(grid, function() {
                t.is(grid.store.getCount(), grid.getView().getNodes().length, 'Rendered all data in store ok');
                t.matchGridCellContent(grid, 0, 0, grid.store.first().getFullName(), 'Found full name in first cell');
            });
        }
    );
});
