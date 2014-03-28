StartTest(function(t) {
    t.getHarness([
        'testfiles/601_siesta_ui_failing.t.js',
        'testfiles/601_siesta_ui_passing.t.js'
    ]);
    
    t.diag('Verify code listing is shown, correct row highlighted');
    
    t.chain(
        { waitFor : 'rowsVisible', args : 'testgrid' },

        { action : 'doubleclick', target : 'testgrid => .x-grid-row' },
        
        { waitFor: 'selector', args : ['.siesta-assertion-grid .tr-assertion-row-failed'] },
            
        function(next, result) {
            t.contentLike(result[0], 'foo', 'Found failed text in assertion grid, awesome');
            t.doubleClick(result[0], next);
        },

        function(next, result) {
            // IE doesn't support stack traces for exceptions 
            if (!Ext.isIE) t.selectorExists('.line.number4.highlighted', 'Line 4 was highlighted');
            
            // in IE8 and probably below, when the resource is cached, its loading will be synchronous
            // because of that doubleclick on the last test row will execute the test synchronously
            // and `testsuiteend` will be fired immediately as well
            // need to subscribe to `testsuiteend` before clicking on the test
            t.chain(
                { waitFor: 'harnessEvent', args : 'testsuiteend' },
        
                function(next, result) {
                    t.notOk(t.cq1('button[action=view-source]').pressed, 'No pressed button exist (source btn)');
                    next();
                },
        
                { action : 'click', target : '>>button[action=view-source]' },
        
                function(next, result) {
                    t.selectorNotExists('.line.highlighted', 'No line was highlighted');
                    next();
                },
        
                { action : 'click', target : 'testgrid => .x-grid-row' },
        
                function(next, result) {
                    t.selectorNotExists('.line.highlighted', 'No line was highlighted');
                    t.selectorExists('.siesta-assertion-grid .x-grid-row', 'Found rows when switching back to first test');
                }
            )
            
            next()
        },
        
        { action : 'doubleclick', target : 'testgrid => .x-grid-row:last-child' }
    );
});
