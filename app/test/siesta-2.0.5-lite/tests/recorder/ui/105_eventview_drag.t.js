StartTest(function (t) {
    t.describe('Function step should work', function (t) {
        document.body.innerHTML = '<div id="div">BAR</div><div id="div2">BAR2</div>'

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
                { type : 'drag', actionTarget : "#div", by : [20, 20], to : null },
                { type : 'drag', actionTarget : "#div", to : [20, 20], to : null }
            ]
        );

        var rec = recorderManager.store.first();
        var view = recorderManager.down('eventview')
        view.editing.startEdit(0, 1);

        t.ok(view.editing.getActiveEditor().field instanceof Siesta.Recorder.DragEditor, 'Formpanel found for drag action');

        t.cq1('targeteditor[name=actionTarget]').setValue('#div2');
        t.cq1('textfield[name=by]').setValue('10,11%');

        t.cq1('drageditor').applyValues();

        t.is(rec.get('actionTarget'), '#div2');
        t.isDeeplyStrict(rec.get('by'), [10, "11%"]);
        t.notOk(rec.get('to'));

        view.editing.startEdit(0, 1);

        t.cq1('drageditor').getPicker().form.reset();

        t.cq1('targeteditor[name=actionTarget]').setValue('1,2%');
        t.cq1('textfield[name=to]').setValue('10,21%');

        t.cq1('drageditor').applyValues();

        t.ok(rec.get('actionTarget') instanceof Array);
        t.ok(rec.get('to') instanceof Array);

        t.isDeeplyStrict(rec.get('actionTarget'), [1, "2%"]);
        t.isDeeplyStrict(rec.get('to'), [10, "21%"]);
        t.notOk(rec.get('by'));

        view.editing.startEdit(0, 1);

        t.it('verify steps', function(t) {
            var recorderManager = new Siesta.Recorder.RecorderPanel({
            });

            recorderManager.store.loadData(
                [
                    { type : 'drag', actionTarget : "#div", by : [20, 20], to : null },
                    { type : 'drag', actionTarget : "#div", to : [30, 30], by : null }
                ]
            );

            var steps = recorderManager.generateSteps();

            t.is(steps.length, 2);

            t.is(steps[0].action, 'drag');
            t.isDeeply(steps[0].by, [20,20]);
            t.notOk(steps[0].to);

            t.is(steps[1].action, 'drag');
            t.isDeeply(steps[1].to, [30,30]);
            t.notOk(steps[1].by);
        });
    })
})