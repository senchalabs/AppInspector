StartTest(function (t) {
    t.expectGlobals('0', '1')
    
    var innerWin, innerExt;

    t.getHarness([
        {
            preload     : [
                '../../../extjs-4.2.1/resources/css/ext-all.css',
                '../../../extjs-4.2.1/ext-all.js'
            ],
            url         : 'testfiles/604_extjs_components.t.js'
        }
    ]);

    function assertSize(cmp) {
        var highlighterEl = Ext.getBody().down('.cmp-inspector-box');

        t.isApprox(highlighterEl.getWidth(), cmp.getWidth() + 5, 3);
        t.isApprox(highlighterEl.getHeight(), cmp.getHeight() + 5, 3);
    }

    t.chain(
        { waitFor : 'harnessReady' },

        function (next) {
            t.waitForHarnessEvent('testsuiteend', next)
            t.runFirstTest();
        },

        function (next) {

            t.cq1('resultpanel').onRecorderClick();

            var recorderPanel = t.cq1('recorderpanel');

            recorderPanel.highlightTarget('>>button[text=Foo]');
            next()
        },

        { waitFor : 1000 },

        function (next) {
            innerWin = t.getActiveTestWindow();
            innerExt = innerWin.Ext;

            var recorderPanel = t.cq1('recorderpanel');

            assertSize(innerExt.ComponentQuery.query('button[text=Foo]')[0]);

            recorderPanel.highlightTarget('>>button[')
            next()
        },

        { waitFor : 1000 },

        function (next) {
            var recorderPanel = t.cq1('recorderpanel');

            // Should keep size if resolving fails
            assertSize(innerExt.ComponentQuery.query('button[text=Foo]')[0]);

            recorderPanel.highlightTarget('button[text=Foo] => span');
            next()
        },

        { waitFor : 1000 },

        function (next) {
            assertSize(innerExt.ComponentQuery.query('button[text=Foo]')[0].el.down('span'));
        }
    );
})