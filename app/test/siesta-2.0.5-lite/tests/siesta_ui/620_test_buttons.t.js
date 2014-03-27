StartTest(function (t) {
    t.getHarness(
        {
            viewDOM : false
        },
        [
            'testfiles/601_siesta_ui_passing.t.js',
            {
                preload : [
                    '../../../extjs-4.2.0/resources/css/ext-all.css',
                    '../../../extjs-4.2.0/ext-all-debug.js'
                ],
                url     : 'testfiles/604_extjs_components.t.js'
            }
        ]
    );

    t.it('Rerun button should work', function (t) {

        t.chain(
            { action : "dblclick", target : "testgrid => .x-grid-row:nth-child(1) > .x-grid-cell:nth-child(1) .x-tree-node-text" },

            { waitFor : 'textPresent', args : 'All tests passed'},

            function(next) {
                t.firesOnce(Harness, 'testsuitestart');
                next();
            },

            { action : "click", target : "toolbar button[text=Re-run test] => .x-btn-icon-el" }
        );
    });

    t.it('Toggle DOM button should work', function (t) {

        t.chain(
            function(next) {
                t.cq1('domcontainer').collapse();
                next()
            },

            { action : "click", target : "toolbar button[iconCls=icon-screen] => .icon-screen" },

            function(next) {
                t.isStrict(t.cq1('domcontainer').getCollapsed(), false)
                next()
            },

            { waitFor : 500 },

            { action : "click", target : "toolbar button[iconCls=icon-screen] => .icon-screen" },

            function(next) {
                t.ok(t.cq1('domcontainer').getCollapsed())
                next()
            }
        );
    });

    t.it('Toggle code view button should work', function (t) {

        t.chain(

            { action : "click", target : "toolbar button[iconCls=icon-file] => .icon-file" },

            function(next) {
                t.is(t.cq1('[slot=cardContainer]').layout.getActiveItem(), t.cq1('[slot=source]'))
                next()
            },

            { action : "click", target : "button[text=Close] => .x-btn-icon-el" }
        )
    });

    t.it('Toggle failed assertion', function (t) {
        t.chain(
            { action : "click", target : "toolbar button[iconCls=icon-bug] => .icon-bug" },

            function(next) {
                t.selectorNotExists('.tr-assertion-row-passed')
                next()
            },

            { action : "click", target : "toolbar button[iconCls=icon-bug] => .icon-bug" },

            function(next) {
                t.selectorExists('.tr-assertion-row-passed')
                next()
            }
        );
    });

    t.it('Toggle inspection mode in non-Ext test', function (t) {
        var dc = t.cq1('domcontainer');

        // No Ext JS loaded in the test
        t.wontFire(dc, 'startinspection');
        t.wontFire(dc, 'stopinspection');

        t.chain(
            { action : "click", target : ">>toolbar button[iconCls=icon-search]" },

            { action : "click", target : ">>toolbar button[iconCls=icon-search]" }
        );
    });

    t.it('Toggle inspection mode', function (t) {
        var dc = t.cq1('domcontainer');

        dc.expand();

        t.firesOnce(dc, 'startinspection');
        t.firesOnce(dc, 'stopinspection');

        t.chain(
            { action : "dblclick", target : "testgrid => .x-grid-row:nth-child(2) " },

            { action : "click", target : ">>toolbar button[iconCls=icon-search]" },

            { action : "click" },

            { waitFor : 'harnessIdle', args : [] }
        );
    });
});