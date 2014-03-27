StartTest(function(t) {

    Ext.Array.each(['click','contextmenu', 'dblclick', 'mousedown','mouseup'], function(ev) {
        t.it(ev, function(t) {
            doTest(t, ev);
        })
    });

    function doTest(t, ev) {

        t.$('body').html('<div id="foo" style="background:#aaa;position:absolute;top:40px;left:20px;height:50px;width:50px"></div>');

        t.it('Should support simple XY offset', function(t) {

            t.chain(
                function(next) {
                    t.$('body').bind(ev, function(e){
                        t.is(e.clientX, 40, 'Correct X');
                        t.is(e.clientY, 60, 'Correct Y');
                    });

                    next()
                },
                { action : ev, target : '#foo', offset : [20, 20] },

                function() {
                    t.$('body').unbind(ev)
                }
            )
        })


        t.it('Should support percent based offset', function(t) {

            t.chain(
                function(next) {

                    t.$('body').bind(ev, function(e){
                        t.is(e.clientX, 45, 'Correct X');
                        t.is(e.clientY, 90, 'Correct Y');
                    });

                    next()
                },

                { action : ev, target : '#foo', offset : ['50%', '100%'] },

                function() {
                    t.$('body').unbind(ev)
                }
            )
        })
    }

    t.it('Should support fromOffset + toOffset for dragging', function(t) {

        t.chain(

            function(next) {

                t.$('body').bind('mousedown', function(e){
                    t.is(e.clientX, 20, 'Correct X');
                    t.is(e.clientY, 30, 'Correct Y');
                });

                t.$('body').bind('mouseup', function(e){
                    t.is(e.clientX, 30, 'Correct X');
                    t.is(e.clientY, 40, 'Correct Y');
                });

                next()
            },

            { drag : document.body, fromOffset : [20, 30], to : document.body, toOffset : [30, 40] },

            function() {
                t.$('body').unbind('mousedown');
                t.$('body').unbind('mouseup');
            }
        )
    })

    t.it('Should support offset for moveCursorTo', function(t) {

        t.chain(
            { action: 'moveCursor', to : document.body, offset : [5,5] },

            function(next) {
                t.isDeeply(t.currentPosition, [5, 5], 'Correct current position');
                next();
            },

            { moveCursorTo: document.body, offset : [20, 30] },

            function(next) {
                t.isDeeply(t.currentPosition, [20, 30], 'Correct current position');
            }
        )
    })
});
