describe('Event view type column', function (t) {

    t.it('Integration test', function (t) {
        document.body.innerHTML = '<div id="div"></div>'

        var view = new Siesta.Recorder.EventView({
            height   : 300,
            width    : 600,
            renderTo : Ext.getBody(),
            test     : t,
            store    : new Ext.data.Store({
                model : 'Siesta.Recorder.RecordedEvent',
                data  : [
                    { type : 'click', actionTarget : '#div', domId : "#div" },
                    { type : 'dblclick', actionTarget : '#div', domId : "#div" },
                    { type : 'type', text : 'asfs' }
                ]
            })
        });

        var record = view.store.first();

        t.chain(
            { waitFor : 'rowsVisible' },

            function (next) {


                view.editing.startEdit(0, 0);
                view.editing.getActiveEditor().setValue('dblclick');
                view.editing.completeEdit();

                t.is(record.get('actionTarget'), '#div', 'Should keep actionTarget when switching the type to same kind of action')
                t.is(record.get('domId'), '#div', 'Should keep domId when switching the type to same kind of action')

                view.editing.startEdit(0, 0);
                view.editing.getActiveEditor().setValue('type');
                view.editing.completeEdit();

                t.notOk(record.get('actionTarget'), 'Should clear actionTarget when switching the type to a new kind')
                t.notOk(record.get('domId'), 'Should clear domId when switching the type to a new kind')
                next();

                view.editing.startEdit(1, 0);
                view.editing.getActiveEditor().setValue('fn');

                next();
            },
            { waitFor : 1000 },

            { type : '[TAB]' },
            { waitFor : 100 },

            function (next) {
                t.ok(view.editing.getActiveEditor().field instanceof Ext.ux.form.field.CodeMirror, 'Should switch to correct editor when using TAB')

                view.editing.startEdit(1, 0);
                view.editing.getActiveEditor().setValue('click');

                next();
            },

            { type : '[TAB]' },
            { waitFor : 100 },

            function (next) {
                t.ok(view.editing.getActiveEditor().field instanceof Siesta.Recorder.TargetEditor, 'Should switch to correct editor when using TAB')

            }
        );
    })
})