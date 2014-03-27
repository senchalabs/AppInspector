StartTest(function (t) {

    function basicClickTest(name) {

        t.it(name, function (t) {

            var btn = new Ext.Button({ id : name, text : name });

            setTimeout(function () {
                btn.render(Ext.getBody());

                t.firesOnce(btn.el, name);
            }, 500)

            t.chain(
                { action : name, target : '#' + name }
            )
        })

    }

    Ext.Array.each([
        'click',
        'dblclick',
        'contextmenu'
    ], basicClickTest)

    t.it('moveMouseTo', function (t) {

        var btn = new Ext.Button({ id : 'moveMouseTo', text : 'moveMouseTo' });

        setTimeout(function () {
            btn.render(Ext.getBody());

            t.firesOnce(btn.el, 'mouseenter');
        }, 500)

        t.chain(
            { moveCursorTo : '#moveMouseTo' }
        )
    })

    t.it('dragBy', function (t) {

        var btn = new Ext.Button({ id : 'dragBy', text : 'dragBy' });

        setTimeout(function () {
            btn.render(Ext.getBody());

            t.firesOnce(btn.el, 'mousedown');
        }, 500)

        t.chain(
            { drag : '#dragBy', by : [2,2] }
        )
    })

    t.it('dragTo', function (t) {

        var btn = new Ext.Button({ id : 'dragTo', text : 'dragTo' });

        setTimeout(function () {
            btn.render(Ext.getBody());

            t.firesOnce(btn.el, 'mousedown');
        }, 500)

        t.chain(
            { drag : '#dragTo', to : [2,2] }
        )
    })
});
