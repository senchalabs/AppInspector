/**
 * Utility class containing methods which run in the context of the inspectedWindow
 */
Ext.define('AI.util.Events', {
    singleton : true,

    requires : [

    ],

    /**
     *
     */
    recordEvents : function () {
        if (!window._recorder) {
            window._recorder = new Ext.create('Ext.ux.event.Recorder', {
                attachTo  : null
            });

            window._componentEvents = [];

            window._recorder.start();
        }

        var events = {
            dom       : window._recorder.getRecordedEvents()
        };

        //clear each time so we don't duplicate
        window._recorder.clear();

        return events;
    },

    /**
     *
     */
    stopEvents : function() {
        if (window._recorder) {
            window._recorder.stop();
            window._recorder.clear();

            window._recorder = null;
        }
    }
});