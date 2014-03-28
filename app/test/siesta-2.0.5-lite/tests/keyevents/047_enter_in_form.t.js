StartTest(function(t) {

    t.testBrowser(function (t) {
        document.body.innerHTML = '<form id="fo" method="post"><input id="txt" type="text"></form>';
        var form = document.getElementById('fo');

        form.onsubmit = function() { return false; };

        t.isCalledOnce("onsubmit", form, 'Expect a form to be posted on ENTER press');

        t.chain(
            {
                action      : 'type',
                target      : '#txt',
                text        : 'Hello[ENTER]'
            },
            second
        )
    });

    function second() {
        t.testJQuery(function (t) {
            // testing click
            document.body.innerHTML += '<form id="fo2" method="post"><input id="txt2" type="text"></form>';
            var called;

            $('#fo2').bind('submit', function() {
                called = true;
                return false;
            });

            t.chain(
                {
                    action      : 'type',
                    target      : '#txt2',
                    text        : 'Woo[ENTER]'
                },
                function() {
                    t.ok(called, 'Form submit detected ok with jQuery');
                }
            )
        });
    }
});

