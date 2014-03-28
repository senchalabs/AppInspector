StartTest(function(t) {
    t.getHarness(
        { autoRun : false, viewDOM : true }, 
        [
            'testfiles/601_siesta_ui_passing.t.js?1',
            'testfiles/601_siesta_ui_passing.t.js?2'
        ]
    );

    var innerTest;

    t.chain(
        { waitFor : 'rowsVisible', args : 'testgrid' },
        
        function (next) {
            Harness.on('testfinalize', next, null, { single : true })
            
            t.doubleClick('testgrid => .x-grid-row:nth-child(1)', function () {})
        },
        function (next) {
            Harness.on('testfinalize', next, null, { single : true })
            
            t.doubleClick('testgrid => .x-grid-row:nth-child(2)', function () {})
        },
        {
            action      : 'click',
            target      : 'testgrid => .x-grid-row:nth-child(1)'
        },
        function () {
            var resultPanel     = t.cq1('resultpanel')

            t.isGreater(resultPanel.el.query('.x-grid-row').length, 0, "Found some assertion rows")
        }
    );
});
