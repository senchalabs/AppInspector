Ext.define('AddressBook.controller.Login', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            loginForm       : 'loginview',
            userNameField   : '#userNameField',
            passwordField   : '#passwordField',
            loginButton     : '#logInButton',
            lockIcon        : '#lockIcon'
        },

        control: {
            'loginview button': {
                tap: 'onLoginTap'
            }
        }
    },

    onServerConnect : function() {
        this.getLoginForm().setMasked({
            xtype   : 'loadmask',
            message : 'Authenticating...'
        });

        Ext.Function.defer(this.onAuthenticateSuccess, 3000, this);
    },

    onAuthenticateSuccess : function() {
        var me = this;
        var loginView = this.getLoginForm();

        me.getLockIcon().setSrc('resources/images/unlock.png');

        loginView.setMasked({
            xtype       : 'loadmask',
            indicator   : false,
            message     : '<h2 style="font-size:130%;">Logged in like a Boss!</h2>'
        });

        setTimeout(function() {
            me.getApplication().fireEvent('loginsuccess', me);
        }, 2000)
    },

    onLoginTap: function() {
        var loginButton = this.getLoginButton();
        var app = this.getApplication();
        var me = this;
        var username = this.getUserNameField().getValue();
        var password = this.getPasswordField().getValue();

        // Don't code like this
        if (username && password && (password === 'SecretPW' || true)) {
            loginButton.disable();

            me.getLoginForm().setMasked({
                xtype   : 'loadmask',
                message : 'Contacting server...'
            });

            Ext.Function.defer(me.onServerConnect, 1000, me);
        }
    }
});
