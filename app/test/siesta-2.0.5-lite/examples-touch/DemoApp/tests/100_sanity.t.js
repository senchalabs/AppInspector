StartTest(function(t) {

    t.chain(
        { 
            waitFor : 'CQ', 
            args    : 'loginview',
            desc    : 'Should find login view on app start'
        },
        
        function(next) {
            t.ok(t.cq1('#logInButton'), 'Should find a login button');
        }
    );
});
