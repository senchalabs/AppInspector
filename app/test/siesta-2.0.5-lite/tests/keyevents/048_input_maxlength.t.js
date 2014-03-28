StartTest(function(t) {

    t.testBrowser(function (t) {
        document.body.innerHTML = '<input id="input" type="text" maxlength="8" />';
        
        var input   = document.getElementById('input');

        t.chain(
            {
                type        : '1234567890',
                target      : input
            },
            function () {
                t.is(input.value, '12345678', "`maxlength` attribute was honored")
            }
        )
    });

});

