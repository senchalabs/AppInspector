StartTest(function (t) {
    document.body.innerHTML = 'foo';

    function getRecorderManager(frame) {
        var recorderManager = new Siesta.Recorder.RecorderPanel({
            width    : 600,
            height   : 300,
            renderTo : document.body
        });
        recorderManager.attachTo(t, frame);

        var recorder = recorderManager.recorder;

        recorder.ignoreSynthetic = false;
        recorder.start();

        return recorderManager;
    }

    t.it('Click with ctrl key', function (t) {
        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : [1, 1], options : { ctrlKey : true } },

            { waitFor : 500 },

            function () {
                var steps = recorderManager.generateSteps();

                recorder.stop();

                t.is(steps.length, 1);
                t.isDeeply(steps[0], { action : "click", target : "body", offset : [1, 1], options : { ctrlKey : true } })
            }
        );
    })

    t.it('Click with ctrl + shift keys', function (t) {
        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : [1, 1], options : { ctrlKey : true, shiftKey : true   } },

            { waitFor : 500 },

            function () {
                var steps = recorderManager.generateSteps();

                recorder.stop();

                t.is(steps.length, 1);
                t.isDeeply(steps[0], { action : "click", target : "body", offset : [1, 1], options : { ctrlKey : true, shiftKey : true } })
            }
        );
    })

    t.it('Typing chars with SHIFT should work', function (t) {
        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;
        var KeyCodes        = Siesta.Test.Simulate.KeyCodes().keys

        var el = document.body;

        t.chain(
            { type : 'f' },

            function(next) {
                t.simulateEvent(el, 'keydown', { keyCode : KeyCodes.SHIFT });
                t.simulateEvent(el, 'keydown', { keyCode : 65 });
                t.simulateEvent(el, 'keypress', { keyCode : 0, charCode : 65, shiftKey : true });
                t.simulateEvent(el, 'keyup', { keyCode : KeyCodes.A });
                t.simulateEvent(el, 'keyup', { keyCode : KeyCodes.SHIFT });

                next()
            },

            { type : 'n' },

            function() {
                t.is(recorderManager.store.getCount(), 1)
                t.is(recorderManager.store.first().data.actionTarget, 'fAn')
            }
        )

    })

})