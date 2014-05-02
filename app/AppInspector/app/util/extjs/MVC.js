Ext.define('AI.util.extjs.MVC', {
    singleton : true,

    getApplication : function() {
        function getControllerListeners(cls) {
            var EventBus       = Ext.app.EventBus,
                domains        = EventBus.domains,
                busControllers = [],
                domain, bus,
                event, events,
                selector,
                controllerId, controllers,
                controller, i, length,
                masterListenerObj, listenerObj, listeners,
                x, len, observableId;

            for (domain in domains) {
                bus = domains[domain].bus;

                for (event in bus) {
                    events = bus[event];

                    for (selector in events) {
                        controllers = events[selector];

                        for (controllerId in controllers) {
                            controller = controllers[controllerId];
                            i          = 0;
                            length     = controller.length;

                            for (; i < length; i++) {
                                masterListenerObj = controller[i];
                                listeners         = masterListenerObj.listeners;
                                x                 = 0;
                                len               = listeners.length;

                                for (; x < len; x++) {
                                    listenerObj  = listeners[x];
                                    observableId = masterListenerObj.observable.$className;

                                    if (observableId !== cls) {
                                        break;
                                    }

                                    busControllers.push({
                                        domain   : domain,
                                        event    : event,
                                        selector : selector,
                                        method   : listenerObj.fireFn.$name
                                    });
                                }
                            }
                        }
                    }
                }
            }

            return busControllers;
        }

        var instance       = Ext.app.Application.instance,
            appControllers = instance.controllers,
            appStores      = instance.stores,
            i              = 0,
            length         = appControllers.length,
            controllers    = [],
            stores         = [],
            children       = [],
            controller, listeners, store, getter;

        for (; i < length; i++) {
            controller = appControllers.getAt(i);
            listeners  = getControllerListeners(controller.$className);

            controllers.push({
                text     : controller.id,
                qtip     : controller.$className,
                type     : 'controller',
                id       : controller.id,
                count    : listeners.length,
                eventbus : listeners,
                leaf     : true
            });
        }

        i      = 0;
        length = appStores.length;

        for (; i < length; i++) {
            store = appStores[i];

            if (Ext.isString(store)) {
                getter = Ext.app.Controller.getGetterName(store, 'Store');
                store  = instance[getter]();
            }

            stores.push({
                text  : store.storeId,
                qtip  : store.$className,
                type  : 'store',
                count : (store.root) ? 'TreeStore' : store.getCount(),
                id    : store.storeId,
                leaf  : true
            });
        }

        children.push({
            text     : 'Application instance',
            type     : 'application',
            expanded : true,
            children : [
                {
                    text : 'name: ' + instance.name,
                    leaf : true
                },
                {
                    text : 'namespace: ' + instance.$namespace,
                    leaf : true
                },
                {
                    text : 'class name: ' + instance.$className,
                    leaf : true
                },
                {
                    text     : 'Controllers',
                    children : controllers
                },
                {
                    text     : 'Stores',
                    children : stores
                }
            ]
        });

        return children;
    }
});

