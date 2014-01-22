/**
 * Utility class containing methods which run in the context of the inspectedWindow
 */
Ext.define('AI.util.touch.Events', {
    singleton : true,

    requires : [

    ],

    /**
     *
     */
    recordEvents : function () {
        var o = Ext.event.Dispatcher.prototype;

        if (!o._fireEvent) {
            o._fireEvent = o.dispatchEvent; //set reference to restore later
            o._eventMonitor = [];

            o.dispatchEvent = function (targetType, target, eventName) {
                o._fireEvent.apply(this, arguments);

                var isComponent = (targetType === 'component');

                var x = {
                    eventName : eventName,
                    source    : (isComponent) ? arguments[3][0].$className : targetType,
                    xtype     : (isComponent) ? arguments[3][0].xtype : '',
                    id        : target
                };

                o._eventMonitor.push(x);
            };
        }

        var events = o._eventMonitor;

        //clear each time so we don't duplicate
        o._eventMonitor = [];

        return events;
    },

    /**
     *
     */
    stopEvents : function () {
        var o = Ext.event.Dispatcher.prototype;

        if (o._fireEvent) {
            o.dispatchEvent = o._fireEvent; //set reference to restore later

            delete o._fireEvent;
            delete o._eventMonitor;
        }
    }
});