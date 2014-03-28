StartTest(function(t) {

    t.chain(
        { waitFor : 'componentVisible', args : '#logInButton' },

        function(next) {
            t.cq1('#userNameField').setValue('John Doe');
            t.cq1('#passwordField').setValue('SecretUnhackablePW');
            next();
        },

        { tap : '>> #logInButton' },

        // We'd like to find a headshot icon the DOM, that's proof the main app has been launched ok
        { waitFor : 'compositeQuery', args : 'contacts => .headshot' },

        function(next) {
            t.willFireNTimes(App, 'logout', 1);
            next();
        },

        { tap : '>>#logoutButton' },

        { waitFor : 'componentVisible', args : 'loginview' },

        function(next) {
            t.pass('Should be able to log out and see login view');
        }
    );
});
