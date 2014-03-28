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

    t.it('Ext JS 3 form', function (t) {
        // 0 - global refrence for iframe in FF, 'frame' - in IE
        t.expectGlobals('0', 'frame')
        
        document.body.innerHTML     = '<iframe id="frame" src="html-pages/extjs3.html" frameborder=0></iframe>'
        var frame                   = document.getElementById('frame');
        
        var recorderManager;
        var recorder;
        
        var Ext3

        t.chain(
            { waitFor : function() { return frame.contentWindow.Ext && frame.contentWindow.Ext.getCmp && frame.contentWindow.Ext.getCmp('theform'); } },

            function(next) {
                recorderManager     = getRecorderManager(frame);
                recorder            = recorderManager.recorder;
                
                Ext3                = frame.contentWindow.Ext
                
                next();
            },

            { click : function () { return Ext3.query("#theform .foo")[ 0 ] } },
            { click : function () { return Ext3.query("#theform .baz")[ 0 ] } },

            { waitFor : 500 },

            function () {
                var steps = recorderManager.generateSteps();

                recorder.stop();

                t.is(steps.length, 2);
                t.isDeeply(steps[0], { action : "click", target : "#theform .foo", offset : [ t.any(Number), t.any(Number) ] })
                t.isDeeply(steps[1], { action : "click", target : "#theform .baz", offset : [ t.any(Number), t.any(Number) ] })
            }
        );
    })
})