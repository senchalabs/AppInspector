/**
 * Utility class containing methods which run in the context of the inspectedWindow
 */
Ext.define('AI.util.extjs.Events', {
    singleton : true,

    /**
     *
     */
    recordEvents : function () {
        var o = Ext.util.Observable.prototype;

        if (!o._eventMonitor) {
            o._eventMonitor = [];

            o._captureFn = function () {
                var eventName = arguments[0],
                    signature = arguments[1];

                if (eventName === 'uievent') {
                    //only fires on on Ext.view.Table
                    eventName = arguments[1];
                    signature = arguments[2];
                }
                else if (eventName === 'beforequery') {
                    //only fires on on Ext.form.field.ComboBox
                    signature = arguments[1].combo;
                }
                else if (signature.length && signature.length > 0) {
                    //a bunch of events fire passing "arguments", which is like an Array but not really...
                    signature = signature[0];
                }

                // <debug>
                // it's conceivable that we're missing special cases somewhere
                if (!signature.$className) {
                    console.log(arguments);
                }
                // </debug>

                Ext.util.Observable.prototype._eventMonitor.push({
                    eventName : eventName,
                    source    : signature.$className,
                    xtype     : signature.xtype,
                    id        : signature.id
                });
            };

            Ext.ComponentManager.each(function (key) {
                Ext.util.Observable.capture(Ext.getCmp(key), o._captureFn);
            });

            //be sure we capture all new components added...
            Ext.ComponentManager.register = Ext.Function.createSequence(Ext.ComponentManager.register, function (item) {
                Ext.util.Observable.capture(item, Ext.util.Observable.prototype._captureFn);
            });
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

        if (o._eventMonitor) {
            Ext.ComponentManager.each(function (key) {
                Ext.util.Observable.releaseCapture(Ext.getCmp(key));
            });

            //don't break the function sequence we created in recordEvents()
            Ext.util.Observable.prototype._captureFn = Ext.emptyFn;

            delete o._eventMonitor;
        }
    }
});