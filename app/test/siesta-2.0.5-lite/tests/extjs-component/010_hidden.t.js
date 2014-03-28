StartTest(function(t) {
    
    t.testExtJS(function (t) {

        t.it('should be able to normalize a hidden component', function (t) {
            var container = Ext.create('Ext.container.Container', {
                renderTo    : Ext.getBody(),
                itemId      : 'hidden',
                hidden      : true
            });

            t.is(t.normalizeElement(container), container.getEl().dom, "Hidden components should be normalized to their root el")

            var afterWait   = false

            t.waitForCQVisible('#hidden', function () {
                t.ok(afterWait, "waitForCQVisible triggered its callback already after 500ms delay and manual call to `setVisible`")
            })

            t.chain(
                'waitFor(500)',
                function () {
                    afterWait       = true
                    container.setVisible(true)
                }
            );
        });

        t.it('should be able to normalize a component correctly which is hidden via scroll', function (t) {
            var container = new Ext.Panel({
                renderTo    : Ext.getBody(),
                height      : 200,
                width       : 300,
                autoScroll  : true,
                layout      : 'vbox',
                items       : [{
                    xtype   : 'component',
                    height  : 200
                }, {
                    xtype   : 'textfield'
                }]
            });

            t.is(t.normalizeElement(container.down('textfield')), container.body.down('input').dom, 'Should find the input element')
        })
    });

    t.it('Should not crash when clicking unrendered component', function (t) {

        t.expectFail(function(t) {
            t.waitForTimeout = t.defaultTimeout = 500;

            t.chain(
                { click: new Ext.button.Button() }
            );
        });
    })
});
