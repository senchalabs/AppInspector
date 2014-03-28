StartTest(function(t) {
    t.waitForSelector('.x-cal-panel', function(els) {
        
        var pnl = Ext.getCmp(els.first().id),
            store = pnl.store,
            rec = store.getAt(store.find('Title', 'Board')),
            originalStart = rec.data.StartDate;

        t.ok(rec.data.StartDate, 'Task has start date');
        t.ok(rec.data.EndDate, 'Task has start date');
        
        t.drag(pnl.el.down('.ext-cal-evt'), null, [-50, -50], function() {
            t.isGreater(originalStart, rec.data.StartDate, 'Task starts earlier after drag drop');
        });
    });
});