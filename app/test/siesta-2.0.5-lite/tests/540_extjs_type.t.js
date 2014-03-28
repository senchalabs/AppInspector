StartTest(function(t) {
    var field       = new Ext.form.TextField({
        emptyText       : 'please enter some text',
        
        renderTo        : Ext.getBody()
    });
    
    t.chain(
        { action : 'click', target : field },
        {
            action      : 'type',
            text        : 'foo'
        },
        function (next) {
            t.hasValue(field, 'foo', 'Correct value typed in the field')
        }
    )
});