StartTest(function (t) {

    var tbar = Ext.Viewport.add(new Ext.Toolbar());
    
    function basicClickTest(name) {

        t.it(name, function (t) {

            var btn = new Ext.Button({ id : name, text : name });

            setTimeout(function () {
                tbar.add(btn);

                t.firesOnce(btn.element, name);
            }, 500)

            t.chain(
                { action : name, target : '#' + name }
            )
        })

    }

    Ext.Array.each([
        'tap',
        'doubletap',
        'longpress'
    ], basicClickTest)

    t.it('dragBy', function (t) {

        var btn = new Ext.Button({ id : 'dragBy', text : 'dragBy' });

        setTimeout(function () {
            tbar.add(btn);

            t.firesOnce(btn.element, 'touchstart');
        }, 500)

        t.chain(
            { drag : '#dragBy', by : [2,2] }
        )
    })

    t.it('dragTo', function (t) {

        var btn = new Ext.Button({ id : 'dragTo', text : 'dragTo' });

        setTimeout(function () {
            tbar.add(btn);

            t.firesOnce(btn.element, 'touchstart');
        }, 500)

        t.chain(
            { drag : '#dragTo', to : [2,2] }
        )
    })
});
