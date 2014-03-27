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
                { type : 'moveCursorBy' }
            ]
        );

        var view = recorderManager.down('eventview')
        view.editing.startEdit(0, 1);

        t.isInstanceOf(view.editing.getActiveEditor().field, Ext.form.TextField, 'Text field found');

        view.editing.getActiveEditor().field.setValue('40,40');
        view.editing.completeEdit();

        t.it('should convert text to array', function(t) {
            var rec = recorderManager.store.first();

            t.isDeeply(rec.data.actionTarget, [40,40]);
        })

        t.it('should generate proper step', function(t) {

            var steps = recorderManager.generateSteps();
            t.is(steps.length, 1);

            t.isDeeply(steps[0], { action : 'moveCursor', by : [40,40] });
        })
    })
})