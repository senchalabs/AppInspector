StartTest(function (t) {
    t.getHarness(
        {
            enableCodeCoverage    : true,
            preload : [
                '../../../extjs-4.2.2/resources/css/ext-all.css',
                '../../../extjs-4.2.2/ext-all-debug.js',

                {
                    instrument : true,
                    url        : 'testfiles/ext_class.js'
                }
            ]
        },
        [
            {
                url     : 'testfiles/605_class_test.t.js'
            }
        ]
    );

    t.it('Should show coverage info', function (t) {
        t.chain(
            { waitFor : 'harnessReady' },

            function(next) {
                var coverageButton = t.cq1('[action=show-coverage]')
                t.ok(coverageButton.isDisabled());
                next();
            },

            { action : "dblclick", target : "testgrid => .x-grid-row:nth-child(1) > .x-grid-cell:nth-child(1) .x-tree-node-text", offset : [99, 9] },

            { waitFor : 'harnessIdle' },

            { action : "click", target : "toolbar button[iconCls=icon-book] => .icon-book", offset : [7, 10] },

            function (next) {
                var coverageTree = t.cq1('coveragereport treepanel');

                t.ok(t.cq1('coveragereport').isVisible(), 'Visible coverage report');
                t.ok(t.cq1('[slot=sourcePanel]').isHidden(), 'Hidden source');

                t.matchGridCellContent(coverageTree, 0, 0, 'My')
                t.matchGridCellContent(coverageTree, 0, 1, '67%', 'Statements')
                t.matchGridCellContent(coverageTree, 0, 2, '100%', 'Branches')
                t.matchGridCellContent(coverageTree, 0, 3, '50%', 'Functions')
                t.matchGridCellContent(coverageTree, 0, 4, '67%', 'Lines')

                t.matchGridCellContent(coverageTree, 1, 0, 'awesome')
                t.matchGridCellContent(coverageTree, 1, 1, '67%', 'Statements')
                t.matchGridCellContent(coverageTree, 1, 2, '100%', 'Branches')
                t.matchGridCellContent(coverageTree, 1, 3, '50%', 'Functions')
                t.matchGridCellContent(coverageTree, 1, 4, '67%', 'Lines')

                t.matchGridCellContent(coverageTree, 2, 0, 'Class')
                t.matchGridCellContent(coverageTree, 2, 1, '67%', 'Statements')
                t.matchGridCellContent(coverageTree, 2, 2, '100%', 'Branches')
                t.matchGridCellContent(coverageTree, 2, 3, '50%', 'Functions')
                t.matchGridCellContent(coverageTree, 2, 4, '67%', 'Lines')

                next();
            },

            { action : "click", target : "coveragereport treepanel => .x-grid-row:nth-child(1) > .x-grid-cell:nth-child(1)" },

            function (next) {
                t.ok(t.cq1('[slot=sourcePanel]').isHidden(), 'Hidden source');
                t.ok(t.cq1('coveragereport chart').isVisible(), 'Visible chart');
                next()
            },

            { action : "click", target : "coveragereport treepanel => .x-grid-row:nth-child(2) > .x-grid-cell:nth-child(1) .x-tree-node-text" },

            function (next) {
                t.ok(t.cq1('[slot=sourcePanel]').isHidden(), 'Hidden source');
                t.ok(t.cq1('coveragereport chart').isVisible(), 'Visible chart');
                next()
            },

            { action : "click", target : "coveragereport treepanel => .x-grid-row:nth-child(3) > .x-grid-cell:nth-child(1) .x-tree-node-text" },

            function (next) {
                t.ok(t.cq1('[slot=sourcePanel]').isVisible(), 'Visible source');
                t.ok(t.cq1('coveragereport chart').isHidden(), 'Hidden chart');
                next()
            },

            { action : "click", target : "toolbar button[text=Close] => .x-btn-icon-el", offset : [12, 8] },

            function (next) {
                t.ok(t.cq1('coveragereport').isHidden(), 'Hidden after close');
            }
        )
    });
});