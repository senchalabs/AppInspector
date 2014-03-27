StartTest(function(t) {
    
    t.diag("You can also test Ext JS code to track the status of a framework bug.");

    Ext.define('foo', { 
        extend: 'Ext.data.Model',
        fields : [ 'bar' ]
    });

    var store = new Ext.data.Store({
           model : 'foo', 
           data : [{ bar: 'test'}]
       }),
       nbrFired = 0;
       rec = store.first();

    store.on('update', function() { 
        nbrFired++;
    });
    
    rec.set('bar', '1');
    rec.beginEdit();
    rec.set('bar', 'test');     // Should trigger an update
    rec.endEdit();

    // This will fail if you switch to using a version > 4.0.2, if the bug is not fixed then.
    t.knownBugIn('4.0.2', function(t) {
        t.is(nbrFired, 2, '2 update events fired');
    });
});