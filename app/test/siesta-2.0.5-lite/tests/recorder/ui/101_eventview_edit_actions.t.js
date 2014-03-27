StartTest(function (t) {

    t.describe('Event view edit target', function (t) {
        var view = new Siesta.Recorder.EventView({
            height   : 300,
            width    : 600,
            renderTo : Ext.getBody(),
            test     : t,
            store    : new Ext.data.Store({
                model   : 'Siesta.Recorder.RecordedEvent',
                data    : [
                    { type : 'click', actionTarget : '#div', domId : "#div" },
                    { type : 'waitForMs', actionTarget : 1000 },
                    { type : 'fn', actionTarget : "Ext.get(div).setStyle('background-color', 'black');" },
                    { type : 'waitForFn', actionTarget : 'return 2 > 1;'}
                ]
            })
        });

        t.it('Editing click target', function (t) {
            t.chain(
                { waitFor : 'rowsVisible' },

                { click : '.x-grid-cell:contains(#div)' },

                { waitFor : 'CQ', args : 'editor{isVisible()}' },

                function (next) {
                    t.ok(view.editing.getActiveEditor().field instanceof Siesta.Recorder.TargetEditor, 'targetEditor ok')
                    next();
                },

                { type : "2[ENTER]" },

                function (next) {
                    t.is(view.store.getAt(0).get('actionTarget'), "#div2", 'Edited regular target ok')
                }
            );
        });

        t.it('Editing waitForMs', function (t) {

            t.chain(
                { waitFor : 'rowsVisible' },

                { click : '.x-grid-cell:contains(1000)' },

                { waitFor : 'CQ', args : 'editor{isVisible()}' },

                function (next) {
                    t.ok(view.editing.getActiveEditor().field instanceof Ext.form.field.Text, 'waitForMs editor ok')
                    next();
                },

                { type : "2[ENTER]" },

                function (next) {
                    t.is(view.store.getAt(1).get('actionTarget'), "10002", 'Edited waitForMs number ok')
                    next();
                }
            );
        });

        t.it('Editing waitForFn', function (t) {

            t.chain(
                { waitFor : 'rowsVisible' },

                { click : '.x-grid-cell:contains(return)' },

                { waitFor : 'CQ', args : 'editor{isVisible()}' },

                function (next) {
                    t.ok(view.editing.getActiveEditor().field instanceof Siesta.Recorder.CodeEditor, 'waitForFn editor ok')
                    next();
                },

                { click : '>>editor{isVisible()}', offset: [-10, 0] },

                function (next) {
                    next();
                }
            );
        });

        t.it('Editing fn', function (t) {

            t.chain(
                { waitFor : 'rowsVisible' },

                { click : '.x-grid-cell:contains(background-color)' },

                { waitFor : 'CQ', args : 'editor{isVisible()}' },

                function (next) {
                    t.ok(view.editing.getActiveEditor().field instanceof Siesta.Recorder.CodeEditor, 'fn editor ok');
                }
            );
        })
    })
})