StartTest(function (t) {

    t.describe('Event view type column', function (t) {
        document.body.innerHTML = '<div id="div"></div>'

        var view = new Siesta.Recorder.EventView({
            height   : 300,
            width    : 600,
            renderTo : Ext.getBody(),
            test     : t,
            store    : new Ext.data.Store({
                model   : 'Siesta.Recorder.RecordedEvent',
                data    : [
                    { type : 'click', actionTarget : '#div', domId : "#div" }
                ]
            })
        });

        var record = view.store.first();

        t.chain(
            { waitFor : 'rowsVisible' },

            function (next) {

                view.editing.startEdit(0,2);
                view.editing.getActiveEditor().setValue('33,100%');
                view.editing.completeEdit();

                t.isDeeply(record.get('offset'), [33, "100%"], 'Offset ok');

                view.editing.startEdit(0,2);
                view.editing.getActiveEditor().setValue('33,0');
                view.editing.completeEdit();

                t.isDeeply(record.get('offset'), [33, 0], 'Offset ok')

                view.editing.startEdit(0,2);
                view.editing.getActiveEditor().setValue('blargh');
                view.editing.completeEdit();

                t.isDeeply(record.get('offset'), [33, 0], 'Crap input ignored')

                view.editing.startEdit(0,2);
                view.editing.getActiveEditor().setValue('foo,bar');
                view.editing.completeEdit();

                t.isDeeply(record.get('offset'), [33, 0], 'Crap input ignored 2')

                next();
            }
        );
    })
})