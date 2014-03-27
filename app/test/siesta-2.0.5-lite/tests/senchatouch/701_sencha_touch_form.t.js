StartTest(function(t) {
    
    t.testSenchaTouch(function (t) {
        var nameFld = new Ext.field.Text({
            label: 'Name',
            labelWidth: '50%'
        });
    
        var searchFld = new Ext.field.Search({
            label: 'search',
            labelWidth: '50%'
        });

        t.chain(
            // adding components to viewport does not layout them synchronously?
            { waitFor : 'event', args : [nameFld, 'painted']},
            { action : 'tap', target : nameFld },
            { action : 'type',  target : nameFld, text : 'foo' },
            { action  : 'tap',  target  : searchFld },
            { action  : 'type', target  : searchFld,  text  : 'foo' },
    
            function(next) {
                t.is(nameFld.getValue(), 'foo', 'textfield: Found typed text');
                t.is(searchFld.getValue(), 'foo', 'searchfield: Found typed text');
            }
        );

        Ext.Viewport.add({
            xtype: 'formpanel',
            items: [ nameFld, searchFld ]
        });
    })
});