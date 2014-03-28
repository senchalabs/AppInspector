StartTest(function (t) {

    document.body.innerHTML = '<div id="div" style="width:50px;height:50px">FOO</div>'

    t.it('Should fire touchstart, touchend on tap simulation', function(t) {
        t.willFireNTimes(Ext.get('div'), 'touchstart', 1);
        t.willFireNTimes(Ext.get('div'), 'touchend', 1);

        t.chain(
            {
                action : 'tap',
                target : '#div'
            }
        );
    })

    t.it('Should fire 1 touchstart, multiple touchmove and 1 touchend on drag simulation', function(t) {
        t.willFireNTimes(Ext.get('div'), 'touchstart', 1);
        t.willFireNTimes(Ext.get('div'), 'touchmove', 5, 'Should see at least 5 touchmove events', true);
        t.willFireNTimes(Ext.get('div'), 'touchend', 1);

        t.chain(
            {
                action : 'drag',
                target : '#div',
                by     : [200, 100]
            }
        );
    })
});