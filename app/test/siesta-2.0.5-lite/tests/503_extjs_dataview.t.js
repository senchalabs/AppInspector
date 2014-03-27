StartTest(function(t) {
    var view = t.getDataView();

    t.waitForViewRendered(view, function() {

        t.expectPass(function (t) {
            t.is(view.el.select(view.itemSelector).item(0).dom, t.getFirstItem(view).dom, 'getFirstItem OK');
        })
    });

    var view2        = t.getDataView({
        store           : new Ext.data.ArrayStore({
            fields      : [ 'foo' ],
            data        : []
        })
    });
        
    // testing that `waitForViewRendered` will handle the case with empty store
    // see: http://bryntum.com/forum/viewtopic.php?f=20&t=1742&p=10421&e=10421
    t.waitForViewRendered(view2, function () {
        t.pass("Reached correct exit point")
    })
});