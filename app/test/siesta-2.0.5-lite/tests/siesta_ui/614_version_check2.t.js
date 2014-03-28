StartTest(function (t) {
    t.requireOk('Ext.ux.ajax.SimManager', function () {

        t.it('Should show upgrade button if you are on old version', function (t) {
            Siesta.meta.VERSION = '12.3.4';

            Ext.ux.ajax.SimManager.init({
                delay : 100
            }).register(
                {
                    'http://bryntum.com/siesta_version' : {
                        responseText  : '{ "name" : "12.3.5" }'
                    },
                    'http://bryntum.com/changelogs/_siesta.php' : {
                        responseText  : 'some changelog data HTML here'
                    }
                }
            );

            t.getHarness(
                { viewDOM : true },
                [ 'testfiles/601_siesta_ui_passing.t.js' ]
            );

            t.chain(
                { waitFor : 'CQ', args : 'button[action=upgrade-siesta]' },

                { click : '>> button[action=upgrade-siesta]' }
            );
        })
    });
});