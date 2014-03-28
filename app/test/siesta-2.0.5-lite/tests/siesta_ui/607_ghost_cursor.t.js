StartTest(function(t) {
    t.getHarness({
        viewDOM         : true
    }, [
        'testfiles/607_ghost_cursor.t.js'
    ]);

    var innerTest;

    t.chain(
        { waitFor : 'rowsVisible', args : 'testgrid' },

        function(next) {
            var store       = t.cq1('testgrid').store;
            var testRecord  = store.getRootNode().firstChild;

            Harness.on('teststart', function(event, test) {
                innerTest = test;
                test.on('testupdate', next, this, { single : true });
            });
            
            t.doubleClick(t.cq1('testgrid').getView().getNode(0), function () {})
        },

        function(next) {
            var cursor      = Ext.select('.ghost-cursor').first();
            var frameXY     = Ext.fly(innerTest.scopeProvider.iframe).getXY();
            
            t.hasCls(innerTest.scopeProvider.iframe, 'tr-iframe', "Correct class added to the iframe")

            t.ok(cursor, 'Found ghost cursor');
            
            t.isDeeply(innerTest.currentPosition, [10, 10], 'Current position should be updated');

            t.isApprox(cursor.getX(), frameXY[0] + innerTest.currentPosition[0], 5, 'Ghost cursor X positioned ok');
            t.isApprox(cursor.getY(), frameXY[1] + innerTest.currentPosition[1], 5, 'Ghost cursor Y positioned ok');

            t.waitForHarnessEvent('testfinalize', next)
        },

        function(next) {
            var cursor      = Ext.select('.ghost-cursor').first();
            var frameXY     = Ext.fly(innerTest.scopeProvider.iframe).getXY();

            t.isDeeply(innerTest.currentPosition, [100, 20], 'Current position should be updated');

            t.isApprox(cursor.getX(), frameXY[0] + innerTest.currentPosition[0], 5, 'Ghost cursor X positioned ok');
            t.isApprox(cursor.getY(), frameXY[1] + innerTest.currentPosition[1], 5, 'Ghost cursor Y positioned ok');
        }
    );
});
