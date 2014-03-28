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
        { 
            waitFor : 'compositeQuery', 
            args    : 'contacts => .headshot',
            desc    : 'Should be able login and see contact list'
        },

        { tap : 'contacts => .headshot' },

        { waitFor : 'componentVisible', args : 'map' },

        function(next) {
            t.pass('Should see a detail view with map after tapping a contact');
        }
    );
});
