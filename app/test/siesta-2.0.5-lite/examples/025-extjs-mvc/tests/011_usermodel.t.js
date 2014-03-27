StartTest(function(t) {

    t.requireOk('AM.model.User', function() {
        var mod = Ext.create('AM.model.User', {
            firstname : 'Slack', 
            lastname : 'Jocum', 
            email : 'some@email.net' 
        });
        
        t.is(mod.getFullName(), 'Slack Jocum', 'getFullName works ok');
        t.is(mod.get('email'), 'some@email.net', 'Could read email');
    });
});
