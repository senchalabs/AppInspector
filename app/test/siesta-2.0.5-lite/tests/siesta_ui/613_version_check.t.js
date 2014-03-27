StartTest(function (t) {
    t.requireOk('Ext.ux.ajax.SimManager', function () {

        t.it('Should not show upgrade button if you are on latest', function (t) {
            Siesta.meta.VERSION = '11.1.1';

            Ext.ux.ajax.SimManager.init({
                delay : 100
            }).register(
                {
                    'http://bryntum.com/siesta_version' : {
                        responseText  : '{ "name" : "11.1.1" }'
                    }
                }
            );

            t.getHarness(
                { viewDOM : true },
                [ 'testfiles/601_siesta_ui_passing.t.js' ]
            );

            t.chain(
                { waitFor : 'HarnessReady' },

                function (next) {
                    t.notOk(t.cq1('upgrade-siesta-btn'), 'Should not find upgrade button')
                    next();
                },

                { waitFor : 5000 },

                function (next) {
                    t.notOk(t.cq1('upgrade-siesta-btn'), 'Should not find upgrade button')
                }
            );
        });
    });
});