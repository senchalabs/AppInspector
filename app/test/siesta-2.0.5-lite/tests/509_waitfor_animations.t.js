StartTest(function (t) {
    document.body.innerHTML = '<div id="one">FOO</div><div id="two">BAR</div>'

    t.expectPass(function (t) {
        Ext.get('one').animate({
            duration : 300,

            to : {
                backgroundColor : '#f00'
            }
        });

        t.chain(
            { waitFor : 'animations' },

            function () {
                t.pass('Passed ok')
            }
        );
    })

    t.expectFail(function (t) {
        t.waitForTimeout = 100;

        Ext.get('two').animate({
            duration : 300,

            to : {
                backgroundColor : '#f00'
            }
        });

        t.chain(
            { waitFor : 'animations' },

            function () {
                t.pass('Failed ok')
            }
        );
    })

});
