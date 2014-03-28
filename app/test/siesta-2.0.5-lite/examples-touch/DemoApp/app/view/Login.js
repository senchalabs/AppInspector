Ext.define('AddressBook.view.Login', {
    extend  : 'Ext.form.Panel',
    xtype   : 'loginview',

    requires: ['Ext.form.FieldSet', 'Ext.form.Password', 'Ext.Label', 'Ext.Img'],

    width   : 300,
    height  : 400,
    centered: true,

    config  : {
        items: [
            {
                xtype   : 'image',
                itemId  : 'lockIcon',
                // CC attribution, icon by Jack Cai http://findicons.com/icon/176046/lock
                src     : 'resources/images/lock.png',
                style   : 'height:80px;margin:auto'
            },
            {
                xtype           : 'label',
                html            : 'Login failed. Please enter the correct credentials.',
                itemId          : 'signInFailedLabel',
                hidden          : true,
                hideAnimation   : 'fadeOut',
                showAnimation   : 'fadeIn',
                style           : 'color:#990000;margin:5px 0px;'
            },
            {
                xtype: 'fieldset',
                title: 'AwesomeCorp - Log in',
                items: [
                    {
                        xtype       : 'textfield',
                        placeHolder : 'Username',
                        itemId      : 'userNameField',
                        name        : 'userNameField',
                        required    : true
                    },
                    {
                        xtype       : 'passwordfield',
                        placeHolder : 'Password',
                        itemId      : 'passwordField',
                        name        : 'passwordField',
                        required    : true
                    }
                ]
            },
            {
                xtype   : 'button',
                itemId  : 'logInButton',
                ui      : 'action',
                padding : '10px',
                text    : 'Log In'
            }
        ]
    }
});
