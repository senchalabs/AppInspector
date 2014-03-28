StartTest(function (t) {
    t.expectGlobal('TestApp')
    
    t.chain(
        { waitFor : 'ComponentQuery', args : 'app-main' },
        function (next) {
            t.monkeyTest(document.body, 10, null, t.done, t);
        }
    )
    
})    