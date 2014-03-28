StartTest(function(t) {
    
    t.testExtJS(function (t) {

        t.it('should be able to normalize a nested CSQ where CSS match is not found in the first top component match', function (t) {
            Ext.create('Ext.form.FieldSet', {
                renderTo : document.body,
                items : [
                    { xtype : 'radiofield' }
                ]
            });

            Ext.create('Ext.form.FieldSet', {
                renderTo : document.body,
                items : [
                    { xtype : 'radiofield', cls : 'foo'}
                ]
            });

            Ext.create('Ext.form.FieldSet', {
                renderTo : document.body,
                items : [
                    { xtype : 'radiofield'}
                ]
            });

            t.is(t.compositeQuery('fieldset => .foo')[0], t.cq1('[cls=foo]').el.dom)
        })
    });
});
