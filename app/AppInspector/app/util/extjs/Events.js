/**
 * Utility class containing methods which run in the context of the inspectedWindow
 */
Ext.define('AI.util.extjs.Events', {
    singleton : true,

    requires : [

    ],

    /**
     *
     */
    recordEvents : function () {
        var o = Ext.util.Observable.prototype;

        if (!o._fireEvent) {
            o._fireEvent = o.fireEvent; //set reference to restore later
            o._eventMonitor = [];

            o.fireEvent = function (h) {
                o._fireEvent.apply(this, arguments);

                o._eventMonitor.push({
                    eventName : arguments[0],
                    source    : arguments[1].$className,
                    xtype     : arguments[1].xtype,
                    id        : arguments[1].id
                });
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
        var o = Ext.util.Observable.prototype;

        if (o._fireEvent) {
            o.fireEvent = o._fireEvent; //set reference to restore later

            delete o._fireEvent;
            delete o._eventMonitor;
        }
    }
});