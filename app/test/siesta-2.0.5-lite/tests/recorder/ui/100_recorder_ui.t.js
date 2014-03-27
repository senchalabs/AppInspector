StartTest(function (t) {

    t.it('Should be able add/remove rows from the grid', function (t) {
        var recorderManager = new Siesta.Recorder.RecorderPanel({
            id           : 'rec1',
            width        : 600,
            height       : 200,
            renderTo     : document.body,

            domContainer : {
                highlightTarget : function() {},
                startInspection : function() {},
                clearHighlight  : function() {}
            }
        });
        recorderManager.attachTo(t);

        recorderManager.store.add({ type : 'click', actionTarget : "body", offset : [5, 5] })

        t.chain(
            { click : '#rec1 .eventview-clearoffset' },

            function (next) {
                t.notOk(recorderManager.store.first().data.offset, 'Offset cleared')
                next();
            },
            { click : '#rec1 .icon-delete' },

            function (next) {
                t.is(recorderManager.store.getCount(), 0, 'Deleted a row')
                next();
            },

            { click : '>>#rec1 [action=recorder-add-step]' },
            { click : '>>#rec1 [action=recorder-add-step]' },

            function (next) {
                t.is(recorderManager.store.getCount(), 2, 'Added two rows')
                next();
            },

            { click : '>>#rec1 [action=recorder-remove-all]' },

            { click : '>>button[text=Yes]' },

            function (next) {
                t.is(recorderManager.store.getCount(), 0, 'Cleared store')

                if (this.getFailCount() === 0) {
                    recorderManager.destroy();
                }
            }
        );
    })

    t.it('Should be able start/stop/play', function (t) {
        var recorderManager = new Siesta.Recorder.RecorderPanel({
            id       : 'rec2',
            width    : 600,
            height   : 200,
            harness  : {
                launch : function () {
                },

                getScriptDescriptor : function () {
                    return {};
                },

                on : function () {
                }
            },
            renderTo : document.body
        });
        recorderManager.attachTo(t);
        recorderManager.recorder.ignoreSynthetic = false;

        t.willFireNTimes(recorderManager, 'startrecord', 1);
        t.willFireNTimes(recorderManager, 'stoprecord', 1);

        t.notOk(recorderManager.recorder.active, 'Recorder inactive at first')

        t.chain(
            { click : '>>#rec2 [action=recorder-start]' },

            function (next) {
                t.ok(recorderManager.recorder.active, 'Recorder active')
                next();
            },

            { click : '#rec2 #eventView => .x-panel-body' },

            { waitFor : 1000 },

            function (next) {
                t.is(recorderManager.store.first().data.type, 'click');
                t.is(recorderManager.store.first().data.actionTarget, '#eventView => .x-panel-body');
                next()
            },

            { click : '>>#rec2 [action=recorder-stop]' },

            function (next) {
                t.notOk(recorderManager.recorder.active, 'Recorder stopped');
                t.isCalled('launch', recorderManager.harness);
                next()
            },

            { click : '>>#rec2 [action=recorder-play]' },

            function () {
                if (this.getFailCount() === 0) {
                    recorderManager.destroy();
                }
            }
        );

    })
})