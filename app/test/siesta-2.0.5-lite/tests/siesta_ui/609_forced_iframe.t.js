StartTest(function(t) {
    t.getHarness(
        { autoRun : false, viewDOM : true }, 
        [
            {
                forceDOMVisible     : true,
                url                 : 'testfiles/601_siesta_ui_passing.t.js'
            }
        ]
    );

    var innerTest;
    
    var iframe

    t.chain(
        { waitFor : 'rowsVisible', args : 'testgrid' },
        
        function (next) {
            Harness.on('testupdate', next, null, { single : true })
            
            t.doubleClick('testgrid => .x-grid-row:nth-child', function () {})
        },
        function (next, event, test) {
            var iframe          = test.scopeProvider.iframe
            
            t.selectorExists('.tr-iframe-forced', 'Found forced iframe')
            
            Harness.on('testfinalize', next, null, { single : true, delay : 300 })
        },
        function (next, event, test) {
            var iframe          = test.scopeProvider.iframe
            var iframeContainer = t.cq1('[slot=domContainer]')
            
            var iframeXY            = Ext.fly(iframe).getXY()
            var iframeContainerXY   = iframeContainer.body.getXY()
            
            t.isApprox(iframeXY[ 0 ], iframeContainerXY[ 0 ], "Iframe is in correct position")
            t.isApprox(iframeXY[ 1 ], iframeContainerXY[ 1 ], "Iframe is in correct position")
            
            t.selectorNotExists('.tr-iframe-forced', 'Forced CSS class should be removed')
        }
    );
});
