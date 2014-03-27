StartTest(function (t) {

    var form = Ext.create('Ext.FormPanel', {
        renderTo      : Ext.getBody(),
        frame         : true,
        title         : 'Register new user',
        bodyPadding   : '5px 5px 0',
        width         : 350,
        fieldDefaults : {
            labelWidth    : 125,
            msgTarget     : 'side',
            autoFitErrors : false
        },
        defaults      : {
            width : 300
        },
        defaultType   : 'textfield',
        items         : [
            {
                fieldLabel : 'Name',
                allowBlank : false,
                name       : 'name'
            },
            {
                fieldLabel : 'Age',
                xtype      : 'numberfield',
                allowBlank : false,
                name       : 'age'
            },
            {
                fieldLabel : 'Email',
                allowBlank : false,
                vtype      : 'email',
                name       : 'email'
            },
            {
                fieldLabel : 'Password',
                allowBlank : false,
                name       : 'pass',
                inputType  : 'password',
                id         : 'pass'
            },
            {
                fieldLabel : 'Confirm Password',
                allowBlank : false,
                name       : 'pass-repeat',
                inputType  : 'password'
            }
        ]
    });

    form.keyNav = Ext.create('Ext.util.KeyNav', form.el, {
        enter : function () {
            form.submit();
        }
    });

    t.pass("Form could be rendered");

    var nameBox = form.down('[name="name"]'),
        ageBox = form.down('[name="age"]'),
        emailBox = form.down('[name="email"]'),
        passBox = form.down('[name="pass"]'),
        pass2Box = form.down('[name="pass-repeat"]');

    form.getForm().on('beforeaction', function () {
        t.notOk(this.isValid(), 'beforeaction was called, form is invalid');
        return false;
    });

    t.chain([
        { action : 'click', target : nameBox },

        function (next) {
            nameBox.focus();
            t.type(nameBox.inputEl, 'Joe Schmoe', next);
        },

        function (next) {
            t.is(nameBox.getValue(), "Joe Schmoe", 'Correct text found in name field');

            ageBox.focus();
            t.type(ageBox, '123[UP]', next);
        },

        function (next) {
            t.is(ageBox.getValue(), "124", 'Correct text found in age field');

            emailBox.focus();
            t.type(emailBox, 'incorrect@email', next);
        },

        function (next) {
            t.is(emailBox.getValue(), "incorrect@email", 'Correct text found in email field');

            passBox.focus();
            t.type(passBox, 'secret', next);
        },

        function (next) {
            pass2Box.focus();
            t.type(pass2Box, 'secret[ENTER]', next);
        },

        function () {
            t.notOk(form.getForm().isValid(), 'Form is not valid, incorrect email entered');

            emailBox.setValue('foo@foo.bar');

            t.ok(form.getForm().isValid(), 'Form is valid');
        }
    ]);
});