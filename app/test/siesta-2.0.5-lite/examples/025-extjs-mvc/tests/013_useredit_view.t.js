StartTest(function(t) {
    t.requireOk(
        [
         'AM.model.User', 
         'AM.view.user.Edit'
         ], 
        function() {
            var record = Ext.create('AM.model.User', {
                firstname : 'Slack', 
                lastname : 'Jocum', 
                email : 'some@email.net' 
            });

            var window = Ext.create('AM.view.user.Edit', {
                height : 200,
                width : 300
            });

            window.show();
            
            window.down('form').loadRecord(record);

            t.is(window.query('button').length, 2, 'Found save and cancel buttons');
            t.is(window.query('field').length, 3, 'Found three fields as expected');

            t.hasValue(window.down('field[name=firstname]'), 'Slack', 'First name ok');
            t.hasValue(window.down('field[name=lastname]'), 'Jocum', 'Last name ok');
            t.hasValue(window.down('field[name=email]'), 'some@email.net', 'Email ok');

            t.willFireNTimes(window, 'destroy', 1);

            t.click(window.down('button[action=close]'));
        }
    );
});
