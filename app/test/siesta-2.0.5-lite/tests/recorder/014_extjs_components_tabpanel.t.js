StartTest(function (t) {

    function getRecorderManager() {
        var recorderManager = new Siesta.Recorder.RecorderPanel({
            width  : 600,
            height : 200
        });
        recorderManager.attachTo(t);

        var recorder = recorderManager.recorder;

        recorder.ignoreSynthetic = false;
        recorder.start();

        return recorderManager;
    }

    t.it('DataView empty', function (t) {

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        Ext.create('Ext.TabPanel', {
            width    : 350,
            height   : 100,

            renderTo : Ext.getBody(),
            items    : [
                {
                    title : 'foooooooooooo'
                },
                {
                    title   : 'barbarbarbar',
                    iconCls : 'somecls'
                },
                {
                    iconCls : 'onlyIconCls'
                }
            ]
        });

        t.chain(
            { click : '>>tab[text=foooooooooooo]' },
            { waitFor : 400 },

            { click : '>>tab[iconCls=somecls]' },
            { waitFor : 400 },

            { click : '>>tab[iconCls=onlyIconCls]' },
            { waitFor : 400 },

            function () {
                recorder.stop();

                var store = recorderManager.store;

                t.is(store.getCount(), 3);

                t.is(store.getAt(0).data.actionTarget, 'tab[text=foooooooooooo] => .x-tab-inner')
                t.is(store.getAt(1).data.actionTarget, 'tab[text=barbarbarbar] => .x-tab-inner')
                t.is(store.getAt(2).data.actionTarget, 'tab[iconCls=onlyIconCls] => .onlyIconCls')
            }
        )
    })
})