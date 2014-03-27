StartTest(function(t) {
    
    t.testExtJS(function (t) {

        t.it('should be able to normalize a nested CSQ where CSS match is not found in the first top component match', function (t) {
            Ext.create('Ext.Component', {
                foo : 'bar'
            });

            t.cqExists('[foo=bar]')

            t.cqNotExists('[foo=bar2]')
        })
    });
});
