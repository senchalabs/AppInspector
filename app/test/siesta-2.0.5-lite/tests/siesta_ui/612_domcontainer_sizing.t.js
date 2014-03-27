StartTest(function(t) {

    // IE always uses forceDomVisible
    if (Ext.isIE) return;

    t.getHarness(
        { viewDOM : true },
        [ 'testfiles/601_siesta_ui_passing.t.js' ]
    );

    t.chain(
        { waitFor : 'HarnessReady' },

        function(next){
            t.runFirstTest(next);
        },

        function(next) {
            var tree = t.cq1('testgrid');
            tree.getSelectionModel().select(tree.getView().store.first());
            next()
        },

        { waitFor : 'rowsVisible', args : 'assertiongrid' },

        function(next) {
            var iframe = Ext.getBody().down('.tr-iframe-wrapper iframe');
            var domContainer = t.cq1('domcontainer');

            t.isGreaterOrEqual(iframe.getX(), domContainer.el.getX() + 10, 'Iframe should be positioned using an offset relative to the domcontainer el')
            t.isGreaterOrEqual(iframe.getY(), domContainer.el.getY() + 10, 'Iframe should be positioned using an offset relative to the domcontainer el')
        }
    );
});