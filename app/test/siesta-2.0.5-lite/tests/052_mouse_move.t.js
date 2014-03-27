StartTest(function(t) {
    
    t.testExtJS(function (t) {
        var parent = Ext.getBody().createChild({
            id : 'parent',
            tag : 'div',
            style: 'width:50px;height:50px;background:#ccc;'
        });

        t.moveMouseTo([100, 0], function() {
            t.isDeeply(t.currentPosition, [100, 0], 'moveMouseTo Input: Array - Cursor moved to correct place');
            
            t.moveMouseTo(parent, function() {
                t.isDeeply(t.currentPosition, [25, 25], 'moveMouseTo Input: Element - Cursor moved to correct place');
                t.done();
            });
        });
    });
});
