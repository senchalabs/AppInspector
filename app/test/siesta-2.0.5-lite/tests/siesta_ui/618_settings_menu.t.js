StartTest(function (t) {
    t.getHarness(
        {
            viewDOM : false,
        },
        [
            'testfiles/601_siesta_ui_passing.t.js'
        ]
    );

    t.it('Should toggle collapse expand', function (t) {

        t.chain(
            { action : "click", target : "toolbar button[iconCls=icon-cog] => .icon-cog", offset : [15, 9] },

            { action : "click", target : ">>#tool-menu{isVisible()} menucheckitem[text=View DOM]"},

            function (next) {
                t.notOk(t.cq1('domcontainer').getCollapsed())
                next();
            },

            { action : "click", target : ">>#tool-menu{isVisible()} menucheckitem[text=View DOM]"},

            function (next) {
                t.ok(t.cq1('domcontainer').getCollapsed())
                next();
            },

            { action : "click", target : "toolbar button[iconCls=icon-cog] => .icon-cog", offset : [15, 9] }
        );
    })

    t.it('Should toggle collapse expand', function (t) {
        t.chain(
            { action : "click", target : "toolbar button[iconCls=icon-cog] => .icon-cog"},

            { action : "click", target : "#tool-menu{isVisible()} menuitem[text=About Siesta] => .x-menu-item-text" },

            function (next) {
                t.ok(t.cq1('domcontainer').getCollapsed())
                next();
            },

            { action : "click", target : "#aboutwindow button[text=Close] => .x-btn-icon-el" }
        );
    });
});