/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.ExtJS.Store

This is a mixin, with helper methods for testing functionality relating to Ext.data.Store class. This mixin is being consumed by {@link Siesta.Test.ExtJS}

*/
Role('Siesta.Test.ExtJS.Store', {
    
    methods : {
        
        /**
         * Waits until all the passed stores have been loaded (fires the "load" event) and calls the provided callback.
         * 
         * This method accepts either variable number of arguments:
         *
         *      t.waitForStoresToLoad(store1, store2, function () { ... })
         * or array of stores:
         * 
         *      t.waitForStoresToLoad([ store1, store2 ], function () { ... })
         * 
         * @param {Ext.data.AbstractStore} store1 The store to load.
         * @param {Ext.data.AbstractStore} store2 The store to load.
         * @param {Ext.data.AbstractStore} storeN The store to load.
         * @param {Function} callback A function to call when the condition has been met.
         */        
        waitForStoresToLoad: function () {
            var Ext         = this.getExt();
            var args        = Array.prototype.concat.apply([], arguments)
            var me          = this;
                                                         // Ext 3
            var baseStoreCls = Ext.data.AbstractStore || Ext.data.Store;
            var callback
            var storesNum;
            
            // First locate the callback
            Joose.A.each(args, function (arg, index) {
                if (me.typeOf(arg) == 'Function') {
                    callback = arg;
                    storesNum = index;
                    return false;
                }
            });

            var loaded      = 0;
            
            me.waitFor({
                method      : function() { return loaded == storesNum; },
                callback    : callback,
                name        : 'waitForStoresToLoad',
                description : storesNum + ' stores to load'
            });

            Joose.A.each(args, function (store) {               
                             // Ext 3       // Ext 4 && ST
                var proxy = (store.proxy || store.getProxy && store.getProxy());
                
                if (!(store instanceof baseStoreCls)) {
                    return false;
                }

                if (!proxy) {
                    storesNum--;
                    return;
                }

                store.on('load', function () {
                    loaded++;
                    proxy.un('exception', exceptionFailure);
                }, null, { single : true });

                var exceptionFailure = function (proxy, response, operation) {
                    var url     = proxy.api && proxy.api.read || proxy.url
                    
                    me.fail("Failed to load the store", "Store [READ] URL: " + url);
                };

                proxy.on('exception', exceptionFailure);
            });
        },

        /**
         * This method is a wrapper around {@link #waitForStoresToLoad} method - it waits for the provided stores to fire the "load" event.
         * In addition to {@link #waitForStoresToLoad} this method also calls the `load` method of each passed store.
         * 
         * This method accepts either variable number of arguments:
         *
         *      t.loadStoresAndThen(store1, store2, function () { ... })
         * or array of stores:
         * 
         *      t.loadStoresAndThen([ store1, store2 ], function () { ... })
         * 
         * @param {Ext.data.AbstractStore} store1 The store to load.
         * @param {Ext.data.AbstractStore} store2 The store to load.
         * @param {Ext.data.AbstractStore} storeN The store to load.
         * @param {Function} callback A function to call when the condition has been met.
         */  
        loadStoresAndThen: function () {
            var Ext = this.getExt();
            this.waitForStoresToLoad.apply(this, arguments);
            
            var args                =  Array.prototype.concat.apply([], arguments)
            
            if (this.typeOf(args[ args.length - 1 ]) == 'Function') args.pop()

            Joose.A.each(args, function (store) {
                var proxy = (store.proxy || store.getProxy && store.getProxy());
                if (proxy && store.load) {
                    store.load();
                }
            });
        },

        /**
         * Passes if the passed store has no data.
         * 
         * @param {Ext.data.AbstractStore} store
         * @param {String} [description] The description of the assertion
         */
        isStoreEmpty : function(store, description) {
            this.is(store.getCount(), 0, description);
        }
    }
});
