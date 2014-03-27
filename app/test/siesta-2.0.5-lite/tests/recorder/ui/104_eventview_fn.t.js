StartTest(function (t) {
    t.expectGlobals('a', 'b', 'c')

    t.describe('Function editor should not validate bad code', function (t) {
        var ed = new Siesta.Recorder.CodeEditor({
            renderTo : document.body,
            height   : 100,
            width    : 100
        });

        ed.setValue('var a = 1;');
        t.ok(ed.isValid())
        t.hasNotCls(ed.el, 'x-form-invalid')

        ed.setValue('var 1,;');
        t.notOk(ed.isValid())

        t.hasCls(ed.el, 'x-form-invalid')
    });

    t.describe('Function step should work', function (t) {

        var recorderManager = new Siesta.Recorder.RecorderPanel({
            id       : 'rec1',
            width    : 600,
            height   : 200,
            renderTo : document.body
        });

        recorderManager.store.loadData(
            [
                { type : 'fn', actionTarget : "window.a = 1;\nb = true;\nwindow.c = 'bar';" },
                { type : 'fn', actionTarget : "Ext.emptyFn();\nif (false) {\n    Ext.emptyFn();\n}" },
                { type : 'waitForFn', actionTarget : "return true;"},
                { type : 'waitForSelector', actionTarget : 'body'}
            ]
        );

        var steps = recorderManager.generateSteps();

        t.is(steps.length, 4);

        t.ok(steps[2].waitFor.toString().match('return true;'));

        t.isDeeply(steps[3], { waitFor : 'Selector', args : 'body' });

        t.chain(
            steps,

            function () {

                t.is(a, 1);
                t.is(b, true);
                t.is(c, 'bar');
            }
        );
    })
})