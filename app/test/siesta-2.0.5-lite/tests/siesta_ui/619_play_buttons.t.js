StartTest(function (t) {
    t.getHarness(
        {
            viewDOM : false,
        },
        [
            'testfiles/601_siesta_ui_passing.t.js'
        ]
    );

    t.it('Should do nothing if no tests are checked', function (t) {

        t.chain(
            function (next) {
                t.wontFire(Harness, 'testsuitestart')
                t.wontFire(Harness, 'testsuiteend')
                next();
            },

            { action : "click", target : ">>toolbar button[iconCls=icon-play]" },
            { action : "click", target : ">>toolbar button[iconCls~=tr-icon-run-failed]" },

            { waitFor : 1000 },

            function() {
                t.elementIsEmpty($('.total-pass')[0])
                t.elementIsEmpty($('.total-fail')[0])
            }
        );
    })

    t.it('Should run checked test', function (t) {
        t.chain(
            function (next) {
                t.firesOnce(Harness, 'testsuitestart')
                t.firesOnce(Harness, 'testsuiteend')

                next();
            },

            { action : "click", target : "testgrid => .x-grid-row:nth-child(1) > .x-grid-cell:nth-child(1) .x-tree-checkbox", offset : [7, 9] },

            { action : "click", target : "toolbar button[iconCls=icon-play] => .icon-play", offset : [14, 14] },
            { waitFor : 1000 },

            function() {
                t.contentLike('.total-pass', "2")
                t.contentLike('.total-fail', "0")
            }
        );
    });

    t.it('Run all should work', function (t) {
        t.chain(
            function (next) {
                t.firesOnce(Harness, 'testsuitestart')
                t.firesOnce(Harness, 'testsuiteend')

                next();
            },

            { action : "click", target : ">>toolbar button[iconCls~=icon-forward]" },

            { waitFor : 1000 }
        );
    });
});