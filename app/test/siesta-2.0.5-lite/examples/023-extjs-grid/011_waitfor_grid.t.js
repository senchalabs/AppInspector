StartTest(function (t) {

    setTimeout(function() {
        var Grid = new Ext.grid.Panel({
            width: 300,
            height: 200,
            renderTo: Ext.getBody(),
            columns: [{ text: 'foo', flex : 1}],
            store: new Ext.data.Store({
                fields: ['id', 'name'],
                data : [{ id : 1, name : 'foo' }]
            })
        });
    }, 2000);

    t.chain(
        {                                   
            waitFor : 'componentQuery', args : 'grid'
        },

        function(next, result) {
            // Do some stuff
            next();    
        },

        {
            action : 'click', target : '>>grid headercontainer'
        }
    )
});
