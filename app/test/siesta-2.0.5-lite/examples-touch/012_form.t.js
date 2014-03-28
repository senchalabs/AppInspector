StartTest(function(t) {
    t.diag('Testing form');

    var nameFld = new Ext.field.Text({
        name: 'name',
        label: 'Name',
        autoCapitalize: false
    });
            
    var passwordFld = new Ext.field.Password({
        name: 'password',
        label: 'Password'
    });

    var emailFld = new Ext.field.Email({
        name: 'email',
        label: 'Email',
        placeHolder: 'you@sencha.com'
    });

    t.is(nameFld.getValue(), '', 'Found empty name field');
    t.is(passwordFld.getValue(), '', 'Found empty pw field');
    t.is(emailFld.getValue(), '', 'Found empty email field');

    Ext.Viewport.add({
        xtype: 'formpanel',
        items: [
            {
                xtype: 'fieldset',
                title: 'Personal Info',
                instructions: 'Please enter the information above.',
                defaults: {
                    required: true,
                    labelAlign: 'left',
                    labelWidth: '40%'
                },
                items: [
                    nameFld,
                    passwordFld,
                    emailFld
                ]
            }
        ]
    });

    t.chain(
        { waitFor : 'event', args : [nameFld, 'painted']},
        { action : 'tap', target : nameFld },
        { action : 'type',  target : nameFld, text : 'foo' }, 
        { action : 'tap', target : passwordFld },
        { action : 'type',  target : passwordFld, text : 'bar' },
        { action : 'tap', target : emailFld },
        { action : 'type',  target : emailFld, text : 'foo@bar.nu' },

        function(next) {
            t.is(nameFld.getValue(), 'foo', 'Found foo');
            t.is(passwordFld.getValue(), 'bar', 'Found bar');
            t.is(emailFld.getValue(), 'foo@bar.nu', 'Found foo@bar.nu');
            next();
        },

        { action : 'tap', target : passwordFld.element.down('.x-clear-icon') },
    
        function() {
            t.is(passwordFld.getValue(), '', 'Found empty email field');
        }
    );
});
