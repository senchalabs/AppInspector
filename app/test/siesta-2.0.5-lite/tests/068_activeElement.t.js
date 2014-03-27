StartTest(function (t) {

    t.it('body', function (t) {
        t.chain(
            { click : [1, 1] },

            function (next) {
                t.is(t.activeElement(), document.body)

                document.body.innerHTML = '<input id="inp" type="text" />'
                next();
            }
        );
    })

    t.it('input', function (t) {

        t.chain(

            function (next) {
                document.body.innerHTML = '<input id="inp" type="text" />'
                next();
            },

            { click : '#inp' },

            function (next) {
                t.is(t.activeElement(), document.getElementById('inp'))

                next();
            }
        );
    });

    t.it('input', function (t) {

        t.chain(
            function (next) {
                document.body.innerHTML = '<iframe width=200 height="200" src="blank.html"/>'
                next();
            },

            // UGH
            { waitFor : 2000 },

//            { waitFor : function() {
//                return $('iframe')[0].contentDocument && $('iframe')[0].contentDocument.body;
//            } },

            { click : 'iframe' },

            function (next) {
                t.is(t.activeElement(), $('iframe')[0].contentDocument.body)
            }
        )
    });
});
