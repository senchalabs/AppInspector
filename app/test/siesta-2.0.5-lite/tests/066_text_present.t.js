StartTest(function(t) {

    t.it('waitForTextPresent', function(t) {

        t.chain(
            { waitFor : 'textPresent', args : 'foo' },

            { waitFor : 'textNotPresent', args : 'foo' },

            function(next) {
                t.pass('All seems well')
            }
        )

        setTimeout(function(){
            document.body.innerHTML = 'foo';
        }, 100);

        setTimeout(function(){
            document.body.innerHTML = 'bar';
        }, 500)
    })
});
