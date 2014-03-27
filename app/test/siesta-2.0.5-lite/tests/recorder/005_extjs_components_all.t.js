StartTest(function (t) {

    function getRecorderManager () {
        var recorderManager = new Siesta.Recorder.RecorderPanel({
            width    : 600,
            height   : 200,
            renderTo : document.body
        });
        recorderManager.attachTo(t);

        var recorder = recorderManager.recorder;

        recorder.ignoreSynthetic = false;
        recorder.start();

        return recorderManager;
    }

    var recorderManager = getRecorderManager();

    t.chain(
        { waitFor : 1000 },

        { click : ">>#form-widgets_header", offset : [330, 22] },

        { click : "#main-container-innerCt", offset : [3, 3] }
    );
})