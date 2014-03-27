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

    t.it('Should produce expected output for a simple mouse scenario', function (t) {
        var win = new Ext.Window({
            itemId  : 'win',
            x       : 0,
            y       : 0,
            height  : 200,
            width   : 100,
            html    : 'foo',
            buttons : [
                {
                    id   : 'btn',
                    text : 'hit me'
                }
            ]
        }).show();

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { drag : '>>#win header', by : [50, 20] },

            { waitFor : 500 },

            function(next) {
                var recorderEvents = recorder.getRecordedEvents();

                t.is(recorderEvents.length, 1);
                t.is(recorderEvents[0].type, 'drag', 'mousedown + mouseup is coalesced => drag');

                next()
            },

            { click : '#btn' },

            function(next) {
                var recorderEvents = recorder.getRecordedEvents();

                t.is(recorderEvents.length, 2);
                t.is(recorderEvents[0].type, 'drag', 'mousedown + mouseup is coalesced => drag');
                t.is(recorderEvents[1].type, 'click', 'click coalesced ok');

                next()
            },

            { waitFor : 500 },

            { drag : '>>#win header', by : [-40, -10] },

            // Wait for the coalesce to happen
            {
                waitFor : function() {
                    return recorderManager.store.getCount() === 3 &&
                           recorderManager.store.last().data.type === 'drag';
                }
            },

            { waitFor : 500 },

            function () {
                var recorderEvents = recorder.getRecordedEvents();
                var steps = recorderManager.generateSteps()

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.it('recorder data', function(t) {
                    t.is(recorderEvents.length, 3);
                    t.is(recorderEvents[0].type, 'drag', 'mousedown, mouseup is coalesced => drag');
                    t.is(recorderEvents[1].type, 'click');
                    t.is(recorderEvents[2].type, 'drag', 'mousedown, mouseup is coalesced => drag');

                })

                t.it('Generated steps', function(t) {
                    t.is(steps[0].action, 'drag', 'action drag');
                    t.isDeeply(steps[0].by, [50, 20], 'drag by');
                    t.notOk(steps[0].to, 'If "by" exists, skip "to"');
                    t.notOk(steps[0].toOffset, 'If "by" exists, skip "toOffset"');

                    t.is(steps[0].target, "#win header => .x-header-text-container", 'drag target');

                    t.is(steps[1].action, 'click');
                    t.is(steps[2].action, 'drag', '1 mousedown, mouseup is coalesced => drag');
                    t.isDeeply(steps[2].by, [-40, -10], 'drag by');
                });

                t.contentLike(recorderManager.down('gridview').getCell(0, recorderManager.down('targetcolumn')), 'by: [50,20]')

                // Reset window position
                win.setPosition(0,0);

                t.chain(
                    steps,

                    { waitFor : 3000 },

                    function() {
                        t.hasPosition(win, 10, 10);
                        t.is(recorderManager.store.getCount(), 3);

                        if (t.getFailCount() === 0) {
                            recorderManager.destroy();
                            win.destroy();
                        }
                    }
                );
            }
        );
    })

    t.it('Should produce expected output when typing', function (t) {
        var txt = new Ext.form.TextField({
            renderTo    : document.body,
            id          : 'txt'
        });
        txt.focus(true);

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.diag('Record');

        t.chain(
            { waitFor : 500 },

            { type : 'foo[BACKSPACE]123,.', target : '>>#txt' },

            { waitFor : 500 },

            function (next) {
                var recorderEvents = recorder.getRecordedEvents();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderManager.store.getCount(), 1, '1 type operation')
                t.is(recorderEvents.length, 18, "9 keyup+keydown pairs")
                t.is(txt.getValue(), 'fo123,.');

                txt.setValue('');

                t.diag('Playback');

                t.chain(
                    recorderManager.generateSteps(),

                    { waitFor : 500 },

                    function() {
                        var record = recorderManager.store.first();

                        t.is(txt.getValue(), 'fo123,.');
                        t.is(record.get('type'), 'type');
                        t.is(record.get('actionTarget'), 'foo[BACKSPACE]123,.');
                        t.matchGridCellContent(recorderManager.down('gridpanel'), 0, 1, 'foo[BACKSPACE]123,.')

                        if (t.getFailCount() === 0) {
                            recorderManager.destroy();
                            txt.destroy();
                        }
                    }
                )
            }
        )
    })
})