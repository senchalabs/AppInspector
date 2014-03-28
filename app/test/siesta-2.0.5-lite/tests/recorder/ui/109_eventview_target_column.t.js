describe('Event view target column', function (t) {

    t.it('Unit test', function (t) {

        var col = new Siesta.Recorder.TargetColumn();

        t.it('Renderer', function(t) {

            var action = new Siesta.Recorder.RecordedEvent(
                { type : 'click', actionTarget : '#div', domId : "#div" }
            );

            t.is(col.renderer('#div', {}, action), '#div');

            action.data.type = 'drag';
            action.data.by = [20, "10%"];

            t.is(col.renderer('#div', {}, action), '#div by: [20,10%]');

            delete action.data.by;
            action.data.to = 'foo';

            t.is(col.renderer('#div', {}, action), '#div to: foo');
        })

        t.it('getTargetEditor', function(t) {
            var action = new Siesta.Recorder.RecordedEvent({ type : 'click' });
            t.isInstanceOf(col.getTargetEditor(action), Siesta.Recorder.TargetEditor, 'click')

            var action = new Siesta.Recorder.RecordedEvent({ type : 'drag' });
            t.isInstanceOf(col.getTargetEditor(action), Siesta.Recorder.DragEditor, 'drag')

            var action = new Siesta.Recorder.RecordedEvent({ type : 'fn' });
            t.isInstanceOf(col.getTargetEditor(action), Siesta.Recorder.CodeEditor, 'fn')

            var action = new Siesta.Recorder.RecordedEvent({ type : 'waitForFn' });
            t.isInstanceOf(col.getTargetEditor(action), Siesta.Recorder.CodeEditor, 'waitForFn')

            var action = new Siesta.Recorder.RecordedEvent({ type : 'waitForMs' });
            t.isInstanceOf(col.getTargetEditor(action), Ext.form.NumberField, 'waitForMs')

            var action = new Siesta.Recorder.RecordedEvent({ type : 'waitForSelector' });
            t.isInstanceOf(col.getTargetEditor(action), Ext.form.TextField, 'waitForSelector')

            var action = new Siesta.Recorder.RecordedEvent({ type : 'waitForAnimations' });
            t.notOk(col.getTargetEditor(action), 'waitForAnimations')
        })

    })
})