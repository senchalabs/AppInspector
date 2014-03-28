Class('Your.Test.Class', {

    isa     : Siesta.Test.SenchaTouch,

    methods: {
        login : function (user, pw, next) {
            var me = this;

            this.chain(
                { waitFor : 'componentVisible', args : '#logInButton' },

                function(next) {
                    me.cq1('#userNameField').setValue(user);
                    me.cq1('#passwordField').setValue(pw);
                    next();
                },

                { tap : '>> #logInButton' },
                { waitFor : 'compositeQuery', args : 'contacts => .headshot' },

                next
            );
        },
            
        setup : function (callback, errback) {
            if (this.url.match(/auto_login/)) {
                // call the `login` method for tests with "auto_login" string in url
                // setup will wait until the login completes
                this.login('TestUser', '12345', callback)
            } else {
                // call the `callback` immediately - setup will proceed to the test start
                // right away
                callback()
            }
        }
    }
});
