StartTest(function (t) {

    t.autoCheckGlobals = false;

    t.testExtJS(function (t) {

        var form = new Ext.form.HtmlEditor({
            height   : 200,
            width    : 200
        });

        t.chain(

            function(next) {
                if (Ext.versions) {
                    form.on('initialize', next);
                } else {
                    t.waitFor(3000, next);
                }
                form.render(document.body);
            },

            { click : form },

            { type : 'foob[BACKSPACE]' },

            function() {
                t.is(form.getValue().length, 3)
                t.is(form.getValue(), 'foo')
            }
        )
    });
});
