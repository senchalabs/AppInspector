StartTest(function (t) {
    t.getHarness([
        {
            preload : [
                '../../../extjs-4.2.0/resources/css/ext-all.css',
                '../../../extjs-4.2.0/ext-all-debug.js'
            ],
            url     : 'testfiles/604_extjs_components.t.js'
        }
    ]);

    t.chain([
        { waitFor : 'harnessReady' },

        { action : "dblclick", target : "#SiestaSelf-testTree => .x-grid-row:nth-child(1) > .x-grid-cell:nth-child(1) .x-tree-node-text", offset : [70, 4] },
        
        { waitFor : 'HarnessIdle' },

        { action : "click", target : "toolbar button[iconCls=icon-search] => .icon-search", offset : [6, 3] },

        { action : "moveCursorTo", target : ">>#SiestaSelf-resultpanel-domContainer", offset : [42, 20] },

        {
            desc    : 'Inspector box at cursor',
            waitFor :  function () {
                var EXT                 = Ext.query('iframe.tr-iframe')[ 0 ].contentWindow.Ext
                
                var buttonInInnerTest   = EXT.ComponentQuery.query('[text=Foo]')[0];
                var domContainer        = t.cq1('domcontainer');
                var boxEl               = Ext.getBody().down('.cmp-inspector-box');
                
                return t.compareObjects({
                    width       : buttonInInnerTest.el.getWidth() + 5,
                    height      : buttonInInnerTest.getHeight() + 5,
                    x           : buttonInInnerTest.getX(),
                    y           : buttonInInnerTest.getY()
                }, {
                    width       : t.anyNumberApprox(boxEl.getWidth(), 5),
                    height      : t.anyNumberApprox(boxEl.getHeight(), 5),
                    x           : t.anyNumberApprox(boxEl.getX() - domContainer.getX() - 5, 5),
                    y           : t.anyNumberApprox(boxEl.getY() - domContainer.getY() - 5, 5)
                })
            }
        }
    ]);
});