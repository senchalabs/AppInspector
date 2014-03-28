StartTest(function (t) {

    function getRecorderManager() {
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

    t.it('Should produce expected targets for clicks', function (t) {
        var win = new Ext.Panel({
            itemId   : 'pan',
            renderTo : document.body,
            height   : 100,
            width    : 100,
            title    : 'foo',
            buttons  : [
                {
                    itemId : 'btn',
                    width  : 100,
                    height : 50,
                    text   : 'hit me'
                }
            ]
        }).show();

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;
        var recordedSteps;

        t.chain(
            { click : 'panel[itemId=pan] => .x-panel-body'},
            { click : '>>#btn' },

            // Coalesce
            { waitFor : 500 },

            function () {
                var recorderEvents = recorder.getRecordedEvents();

                recorder.stop();

                t.is(recorderEvents.length, 2);

                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[0].actionTarget, '#pan => .x-panel-body');
                t.is(recorderEvents[0].targetType, 'csq');

                t.is(recorderEvents[1].type, 'click');
                t.like(recorderEvents[1].actionTarget, '#btn => \.x-btn-');
                t.is(recorderEvents[1].targetType, 'csq');

                t.isApprox(recorderEvents[1].offset[0], 50, 5);
                t.isApprox(recorderEvents[1].offset[1], 25, 5);

                if (t.getFailCount() === 0) {
                    recorderManager.destroy();
                    win.destroy();
                }
            }
        );
    });

    t.it('Should produce expected targets for window header click', function (t) {
        var win = new Ext.Window({
            itemId   : 'win',
            x        : 0,
            y        : 0,
            renderTo : document.body,
            height   : 100,
            width    : 100,
            title    : 'foo'
        }).show();

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;
        var recordedSteps;

        t.chain(
            { click : '>>window header' },

            // Coalesce
            { waitFor : 500 },

            function () {
                var recorderEvents = recorder.getRecordedEvents();

                recorder.stop();

                t.is(recorderEvents.length, 1);

                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[0].actionTarget, '#win header[title=foo] => .x-header-text-container');
                t.is(recorderEvents[0].targetType, 'csq');

                if (t.getFailCount() === 0) {
                    recorderManager.destroy();
                    win.destroy();
                }
            }
        );
    })
})