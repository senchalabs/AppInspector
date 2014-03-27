StartTest(function (t) {

    function getRecorderManager() {
        var recorderManager = new Siesta.Recorder.RecorderPanel({
            width    : 600,
            height   : 300,
            renderTo : document.body
        });
        recorderManager.attachTo(t);

        var recorder = recorderManager.recorder;

        recorder.ignoreSynthetic = false;
        recorder.start();

        return recorderManager;
    }

    t.it('Simple HTML', function (t) {
        document.body.innerHTML = '<div class="foo" style="background:gray;width:100px;height:100px">FOO</div><div id="bar" style="background:yellow;width:100px;height:100px">BAR</div>'

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { moveCursorTo : '.foo' },
            { action : 'mouseDown', target : '.foo' },
            { moveCursorTo : [150, 150] },
            { waitFor : 4000 },
            { moveCursorTo : "#bar" },
            { waitFor : 4000 },
            { action : 'moveCursor', by : [10, 10] },
            { action : 'mouseUp' },
            { waitFor : 1000 },

            function () {

                var steps = recorderManager.generateSteps();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(steps.length, 5);
                t.is(steps[0].action, 'mousedown');
                t.is(steps[0].target, '.foo');
                t.isDeeply(steps[0].offset, [50, 50]);

                t.is(steps[1].action, 'moveCursorTo');
                t.is(steps[1].target.toLowerCase(), 'body');
                t.isDeeply(steps[1].offset, [150, 150]);

                t.is(steps[2].action, 'moveCursorTo');
                t.is(steps[2].target, '#bar');
                t.isDeeply(steps[2].offset, [50, 50]);

                t.is(steps[3].action, 'moveCursorTo');
                t.is(steps[3].target, '#bar');
                t.isDeeply(steps[3].offset, [60, 60]);

                t.is(steps[4].action, 'mouseup');
                t.is(steps[4].target, '#bar');
                t.isDeeply(steps[4].offset, [60, 60]);
            }
        )
    })
})