/**
 * @class   AI.util.touch.Events
 * @singleton
 *
 * Utility class containing methods which run in the context of the inspectedWindow
 */
Ext.define('AI.util.touch.Events', {
    singleton: true,

    /**
     *
     */
    recordEvents: function() {
        var o = Ext.event.Dispatcher.prototype;

        if (Ext.ux.AppInspector.eventCache === null) {
            Ext.ux.AppInspector.eventCaptureFn = o.dispatchEvent; //set reference to restore later
            Ext.ux.AppInspector.eventCache = [];

            o.dispatchEvent = function(targetType, target, eventName) {
                Ext.ux.AppInspector.eventCaptureFn.apply(this, arguments);

                var isComponent = (targetType === 'component');

                var x = {
                    eventName: eventName,
                    source: (isComponent) ? arguments[3][0].$className : targetType,
                    xtype: (isComponent) ? arguments[3][0].xtype : '',
                    cmpId: target
                };

                Ext.ux.AppInspector.eventCache.push(x);
            };
        }

        var events = Ext.ux.AppInspector.eventCache;

        //clear each time so we don't duplicate
        Ext.ux.AppInspector.eventCache = [];

        return events;
    },

    /**
     *
     */
    stopEvents: function() {
        var o = Ext.event.Dispatcher.prototype;

        if (Ext.ux.AppInspector.eventCache !== null) {
            o.dispatchEvent = Ext.ux.AppInspector.eventCaptureFn; //set reference to restore later

            Ext.ux.AppInspector.eventCaptureFn = null;
            Ext.ux.AppInspector.eventCache = null;
        }
    }
});
