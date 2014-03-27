StartTest(function(t) {
    t.diag("Sanity test, loading classes on demand and verifying they were indeed loaded.")
    
    t.ok(Ext, 'ExtJS is here');

    t.requireOk('AM.controller.Users');
    t.requireOk('AM.model.User');
    t.requireOk('AM.store.Users');
    t.requireOk('AM.view.user.Edit');
    t.requireOk('AM.view.user.List');
})    
