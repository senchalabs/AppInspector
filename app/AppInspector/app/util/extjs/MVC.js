Ext.define('AI.util.extjs.MVC', {
    singleton : true,

    getApplication : function() {
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
                x, len, observableId, method;

            for (domain in domains) {
                bus = domains[domain].bus;

                for (event in bus) {
                    events = bus[event];

                    for (selector in events) {
                        controllers = events[selector];

                        for (controllerId in controllers) {
                            controller = controllers[controllerId];

                            //Ext 5 nests it, Ext 4/ST2 does not
                            if (controller.list) {
                                controller = controller.list;
                            }

                            i      = 0;
                            length = controller.length;

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

                                    method = listenerObj.fireFn;

                                    //Ext 5 lazily resolves actual method
                                    if (Ext.isFunction(method)) {
                                        method = method.$name;
                                    }

                                    busControllers.push({
                                        domain   : domain,
                                        event    : event,
                                        selector : selector,
                                        method   : method
                                    });
                                }
                            }
                        }
                    }
                }
            }

            return busControllers;
        }

        var appControllers = instance.controllers || [],
            appStores      = instance.stores || [],
            i              = 0,
            length         = appControllers.length,
            controllers    = [],
            stores         = [],
            controller, listeners, controllerName,
            store, getter;

        for (; i < length; i++) {
            controller = appControllers.getAt(i);
            listeners  = getControllerListeners(controller.$className);
            controllerName = controller.$className;

            controllers.push({
                text     : controllerName,
                qtip     : controller.$className,
                type     : 'controller',
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
            expanded : true,
            children : [
                {
                    text : 'name: ' + (instance.getName ? instance.getName() : instance.name),
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
                    text     : 'Controllers (' + controllers.length + ')',
                    children : controllers
                },
                {
                    text     : 'Stores (' + stores.length + ')',
                    children : stores
                }
            ]
        });

        return children;
    }
});

