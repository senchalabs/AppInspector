StartTest(function(t) {
    //=================================================================
    t.diag("Sencha Touch map test");

    t.ok(google.maps, 'Google Maps loaded on page, version ' + google.maps.version);
    
    var trafficButton;

    t.chain(
        { waitFor : 'componentQuery', args : ['button[iconCls=maps]'] },
        
        // 'result' is the result from the waitFor callback method - in this case the ComponentQuery result.
        function(next, result) {
            trafficButton = result[0];
            
            // Make sure button correctly fires tap event before test is done
            t.willFireNTimes(trafficButton, 'tap', 1, 'Tap fired ok');
            
            t.ok(trafficButton.up('segmentedbutton').isPressed(trafficButton), 'Traffic mode enabled by default');
            next();
        },
                 
        { waitFor : 1000 },
        { action : 'tap', target : '>>button[iconCls=maps]' },
        
        // using ComponentQuery to target the map component via its xtype to use as source
        { action : 'drag', source : '>>map', by : [-100, -100] },

        function(next) {
            t.notOk(trafficButton.up('segmentedbutton').isPressed(trafficButton), 'Traffic mode disabled after tap');
            next();
        },

        { action : 'drag', source : '>>map', by : [-100, -100] },
        { action : 'doubletap', target: '>>map' }
    );
});
