/**
 * @class   AI.util.touch.MVC
 * @singleton
 */
Ext.define('AI.util.touch.MVC', {
    singleton: true,

    getApplication: function() {
        var children = [];

        if (!Ext.app || !Ext.app.Application) {
            return children;
        }

        var instance = Ext.app.Application.instance;

        if (!instance) {
            var key;

            for (key in window) {
                if (window.hasOwnProperty(key) && window[key] && window[key].app && window[key].app.$className) {
                    instance = Ext.app.Application.instance = window[key].app;
                    break;
                }
            }
        }

        if (!instance) {
            return children;
        }

        var instanceControllers = instance.getControllerInstances(),
            instanceStores = instance.getStores(),
            controllers = [],
            stores = [],
            i = 0,
            length = instanceStores.length,
            listeners,
            className, controller, control,
            selector, events, event,
            store;

        for (className in instanceControllers) {
            controller = instanceControllers[className];
            control = controller.getControl();
            listeners = [];

            for (selector in control) {
                events = control[selector];

                for (event in events) {
                    listeners.push({
                        selector: selector,
                        event: event,
                        method: events[event]
                    });
                }
            }

            controllers.push({
                type: 'controller',
                qtip: className,
                text: className,
                count: listeners.length,
                eventbus: listeners,
                leaf: true
            });
        }

        for (; i < length; i++) {
            store = instanceStores[i];

            stores.push({
                text: store.getStoreId(),
                qtip: store.$className,
                type: 'store',
                count: (store.root) ? 'TreeStore' : store.getCount(),
                id: store.getStoreId(),
                leaf: true
            });
        }

        children.push({
            text: 'Application instance',
            expanded: true,
            children: [{
                text: 'name: ' + instance.getName(),
                leaf: true
            }, {
                text: 'Controllers (' + controllers.length + ')',
                children: controllers
            }, {
                text: 'Stores (' + stores.length + ')',
                children: stores
            }]
        });

        return children;
    }
});
