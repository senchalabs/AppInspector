StartTest(function(t) {
    t.getHarness([
        'testfiles/601_siesta_ui_failing.t.js'
    ]);

    t.diag('Verify no layouts occur due to assertion added to its store');

    var before      = 0;
    
    var getLayoutCount = function () {
        var count   = 0
        
        Ext.each(Ext.ComponentQuery.query('container'), function(c) {
            count += c.layoutCounter;
        });
        
         count
    }

    t.chain(
        { waitFor : 'rowsVisible', args : 'testgrid' },
        function (next) {
            t.waitForHarnessEvent('testsuiteend', next)
            
            t.doubleClick('testgrid => .x-grid-row', function () {})
        },

        function (next) {
            before  = getLayoutCount()
            
            var testgrid = Ext.ComponentQuery.query('testgrid')[0];
            
            // Adding an assertion should not cause a relayout, same goes for view refresh
            testgrid.store.tree.getNodeById('testfiles/601_siesta_ui_failing.t.js').get('test').pass("some assertion")

            // Updating a test record should not cause a relayout, same goes for view refresh
            testgrid.getRootNode().firstChild.set('title', 'foo');

            t.is(getLayoutCount(), before, 'No layouts caused by test')
        }
    );
});
