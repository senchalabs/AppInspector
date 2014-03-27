StartTest(function (t) {

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

    t.it('Menu test', function (t) {

        // Menus require a bit of special treatment since a submenu doesn't open sync,
        // We may actually need to automatically inject a 'waitForTarget' statement before clicking a menu item
        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        new Ext.SplitButton({
            renderTo : document.body,
            text : 'Button with menu',
            width : 130,
            menu : {
                items : [
                    {
                        text    : 'Foo',
                        handler : function () {
                        }
                    },
                    {
                        text    : 'Bar',
                        handler : function () {},
                        menu    : {
                            items : [
                                { text : 'Bacon' }
                            ]
                        }
                    }
                ]
            }
        });

        var recorderManager, recorder;

        t.chain(
            { click : 'splitbutton[text=Button with menu] => .x-btn-split', offset : [115, 5] },
            { moveCursorTo : 'menu{isVisible()} menuitem[text=Bar] => .x-menu-item-text', offset : [10, 10] },
            { waitFor : 3500 },
            { waitFor : 'target', args : 'menu{isVisible()} menuitem[text=Bacon] => .x-menu-item-text' },
            { click : 'menu{isVisible()} menuitem[text=Bacon] => .x-menu-item-text', offset : [10, 10] },

            { waitFor : 500 },

            function () {
                var steps = recorderManager.generateSteps();

                recorder.stop();

                t.is(steps.length, 3)
                t.isDeeply(steps[0], { action : "click", target : "splitbutton[text=Button with menu] => .x-btn-split", offset : [115, 5] })
                t.isDeeply(steps[1], { action : "moveCursorTo", target : 'menu{isVisible()} menuitem[text=Bar] => .x-menu-item-text', offset : [10, 10]  })
                t.isDeeply(steps[2], { action : "click", target : "menu{isVisible()} menuitem[text=Bacon] => .x-menu-item-text", offset : [10, 10] })
            }
        )
    })
})