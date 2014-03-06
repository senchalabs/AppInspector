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

        if (Ext.ux.AppInspector.eventCache === null) {
            Ext.ux.AppInspector.eventCache = [];

            Ext.ux.AppInspector.eventCaptureFn = function () {
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

                Ext.ux.AppInspector.eventCache.push({
                    eventName : eventName,
                    source    : signature.$className,
                    xtype     : signature.xtype,
                    id        : signature.id
                });
            };

            Ext.ComponentManager.each(function (key) {
                Ext.util.Observable.capture(Ext.getCmp(key), Ext.ux.AppInspector.eventCaptureFn);
            });

            //be sure we capture all new components added...
            Ext.ComponentManager.register = Ext.Function.createSequence(Ext.ComponentManager.register, function (item) {
                Ext.util.Observable.capture(item, Ext.ux.AppInspector.eventCaptureFn);
            });
        }

        var events = Ext.ux.AppInspector.eventCache;

        //clear each time so we don't duplicate
        Ext.ux.AppInspector.eventCache = [];

        return events;
    },

    /**
     *
     */
    stopEvents : function () {
        if (Ext.ux.AppInspector.eventCache) {
            Ext.ComponentManager.each(function (key) {
                Ext.util.Observable.releaseCapture(Ext.getCmp(key));
            });

            //don't break the function sequence we created in recordEvents()
            Ext.ux.AppInspector.eventCaptureFn = Ext.emptyFn;

            Ext.ux.AppInspector.eventCache = null;
        }
    }
});