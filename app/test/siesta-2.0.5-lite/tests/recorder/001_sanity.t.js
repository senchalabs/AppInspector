StartTest(function (t) {

    function getRecorderManager() {
        var recorderManager = new Siesta.Recorder.RecorderPanel({
            width    : 600,
            height   : 200,
            renderTo : document.body,
            margin   : 50
        });
        recorderManager.attachTo(t);

        var recorder = recorderManager.recorder;

        recorder.ignoreSynthetic = false;
        recorder.start();

        return recorderManager;
    }

    t.it('BODY + Offset should work', function (t) {
        document.body.style.padding = '50px';

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : [10, 10] },

            // Coalesce
            { waitFor : 500 },

            function () {
                var ev = recorderManager.store.first();

                t.is(ev.data.type, 'click');
                t.is(ev.data.actionTarget.toLowerCase(), 'body');
                t.isDeeply(ev.data.offset, [10, 10]);
            }
        )
    });
})