StartTest(function (t) {
    t.describe('Function step should work', function (t) {
        var recorderManager = new Siesta.Recorder.RecorderPanel({
            width    : 600,
            height   : 200,
            renderTo : document.body,

            domContainer : {
                highlightTarget : function() {},
                startInspection : function() {},
                clearHighlight  : function() {}
            }
        });
        recorderManager.attachTo(t);

        recorderManager.store.loadData(
            [
                { type : 'drag', actionTarget : "#div", by : [20, 20] },
                { type : 'click', actionTarget : "#div" }
            ]
        );

        var view = recorderManager.down('eventview')
        view.editing.startEdit(0, 1);

        t.ok(view.editing.getActiveEditor().field instanceof Siesta.Recorder.DragEditor, 'Formpanel found for drag action');

        t.cq1('targeteditor[name=actionTarget]').setValue('#div2');
        t.cq1('textfield[name=by]').setValue('10,11%');

        t.chain(
            { drag : '.x-grid-cell:contains(drag)', by : [0, 30] },

            function() {
                var rec = recorderManager.store.first();
                t.is(rec.get('type'), 'click');
            }
        )
    })
})