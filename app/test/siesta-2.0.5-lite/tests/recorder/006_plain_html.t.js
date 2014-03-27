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

    t.it('Label field click (triggers extra click)', function (t) {
        document.body.innerHTML = '<label id="lab" for="foo">BAR</label><input id="foo">'

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : '#lab' },

            { waitFor : 500 },

            function (next) {

                var recorderEvents = recorder.getRecordedEvents();

                t.is(recorderEvents.length, 1);
                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[0].actionTarget, '#lab');

                recorder.stop();
                recorderManager.clear();
                recorder.start();

                next()
            },

            { rightclick : '#lab' },

            { waitFor : 500 },

            function (next) {

                var recorderEvents = recorder.getRecordedEvents();

                t.is(recorderEvents.length, 1);
                t.is(recorderEvents[0].type, 'contextmenu');
                t.is(recorderEvents[0].actionTarget, '#lab');

                recorder.stop();
                recorderManager.clear();
                recorder.start();

                next()
            },

            { doubleclick : '#lab' },

            { waitFor : 500 },

            function () {

                t.is(recorderManager.store.getCount(), 1);
                t.is(recorderManager.store.first().data.type, 'dblclick');
                t.is(recorderManager.store.first().data.actionTarget, '#lab');

                recorder.ignoreSynthetic = true;
                recorder.stop();
            }
        )
    })
})