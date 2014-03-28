StartTest(function (t) {

    t.it('Event view', function (t) {
        var view = new Siesta.Recorder.EventView({
            height   : 200,
            width    : 400,
            renderTo : Ext.getBody(),
            test     : t,
            store    : new Ext.data.Store({
                sorters : 'index',
                proxy   : 'memory',
                model   : 'Siesta.Recorder.RecordedEvent',
                data    : [
                    { type : 'click', actionTarget : '#div', domId : "#div" },
                    { type : 'waitForMs', actionTarget : 1000 },
                    { type : 'fn', actionTarget : "Ext.get(div).addCls('black');" }
                ]
            })
        });

        t.chain(
            { waitFor : 'rowsVisible' },
            { action : "dblclick", target : "eventview => .x-grid-row:nth-child(2) > .eventview-typecolumn" },

            { waitFor : 'selectorAtCursor', args : 'input'},

            { waitFor : 100 },

            { action : "type", text : "fn" },
            { click : ">>eventview", offset : [10, '100%'] }
        );
    })
})