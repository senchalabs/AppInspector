StartTest(function (t) {
    t.diag('Testing a nested list');
    t.expectGlobal('ListItem');

    var data = {
        text  : 'Groceries',
        items : [
            { text : 'Drinks', leaf : true }
        ]
    };

    Ext.define('ListItem', {
        extend : 'Ext.data.Model',
        config : {
            fields : [
                {
                    name : 'text',
                    type : 'string'
                }
            ]
        }
    });

    var store = Ext.create('Ext.data.TreeStore', {
        model               : 'ListItem',
        defaultRootProperty : 'items',
        root                : data
    });

    var list = Ext.create('Ext.NestedList', {
        fullscreen   : true,
        displayField : 'text',
        store        : store
    });
    Ext.Viewport.add(list);

    t.willFireNTimes(Ext.getBody(), 'doubletap', 1);
    t.willFireNTimes(Ext.getBody(), 'longpress', 1);

    t.chain(
        {
            waitFor : 'selector',
            args    : '.x-list-item'
        },
        {
            action : 'tap',
            target : '.x-list-item'
        },

        function (next) {
            var sel = list.getActiveItem().selected;

            t.is(sel.getCount(), 1, '1 item selected');

            next();
        },
        {
            action : 'doubletap'
        },
        { waitFor : 500 },
        {
            action : 'longpress'
        }
    );
});