/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.ExtJS.Observable

This is a mixin, with helper methods for testing functionality relating to Ext.util.Observable class. This mixin is being consumed by {@link Siesta.Test.ExtJS}

*/
Role('Siesta.Test.ExtJS.Observable', {
    
    methods : {
        
        addListenerToObservable : function (observable, event, listener) {
            // The way events are fired is slightly different for Ext vs raw DOM tests
            if (observable.nodeName && observable.tagName) {
                observable = this.Ext().get(observable);
            }

            if (observable.on && observable.un)
                observable.on(event, listener)
            else
                this.SUPERARG(arguments)
        },
        
        
        removeListenerFromObservable : function (observable, event, listener) {
            // The way events are fired is slightly different for Ext vs raw DOM tests
            if (observable.nodeName && observable.tagName) {
                observable = this.Ext().get(observable);
            }

            if (observable.on && observable.un)
                observable.un(event, listener)
            else
                this.SUPERARG(arguments)
        },

        /**
         * This assertion passes if the observable does not fire the specified event(s) after calling this method.
         * 
         * Its overriden in this role, so you can also provide Ext.util.Observable instances to it, otherwise its identical to parent method.
         * 
         * @param {Ext.util.Observable/Mixed} observable Ext.util.Observable instance or any browser observable, window object, element instances, CSS selector.
         * @param {String/Array[String]} event The name of event or array of such
         * @param {String} desc The description of the assertion.
         * 
         * @method wontFire
         */
        

        /**
         * This assertion passes if the observable fires the specified event exactly once after calling this method.
         * 
         * Its overriden in this role, so you can also provide Ext.util.Observable instances to it, otherwise its identical to parent method.
         * 
         * @param {Ext.util.Observable/Mixed} observable Ext.util.Observable instance or any browser observable, window object, element instances, CSS selector.
         * @param {String/Array[String]} event The name of event or array of such
         * @param {String} desc The description of the assertion.
         * 
         * @method firesOnce
         */

        /**
         * This assertion passes if the observable fires the specified event at least `n` times after calling this method.
         * 
         * Its overriden in this role, so you can also provide Ext.util.Observable instances to it, otherwise its identical to parent method.
         * 
         * @param {Ext.util.Observable/Mixed} observable Ext.util.Observable instance or any browser observable, window object, element instances, CSS selector.
         * @param {String} event The name of event
         * @param {Number} n The minimum number of events to be fired
         * @param {String} desc The description of the assertion.
         * 
         * @method firesAtLeastNTimes
         */
        
        
        /**
         * This method will wait for the first `event`, fired by the provided Ext JS `observable` and will then call the provided callback.
         * 
         * @param {Ext.util.Observable/String/Ext.Element} observable The observable to wait on, or a ComponentQuery matching a component
         * @param {String} event The name of the event to wait for
         * @param {Function} callback The callback to call 
         * @param {Object} scope The scope for the callback
         * @param {Number} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForEvent : function (observable, event, callback, scope, timeout) {
            var Ext         = this.Ext();
            observable      = this.normalizeComponent(observable);
            
            if (observable && observable.un && observable.on) {
                var eventFired      = false
            
                observable.on(event, function () { eventFired = true }, null, { single : true })
            
                return this.waitFor({
                    method          : function() { return eventFired; }, 
                    callback        : callback,
                    scope           : scope,
                    timeout         : timeout,
                    assertionName   : 'waitForEvent',
                    description     : ' observable to fire its "' + event + '" event'
                });
            } else {
                return this.SUPERARG(arguments);
            }
        },
        
        
        /**
         * This method passes if the provided `observable` has a listener for the `eventName`
         * 
         * @param {Ext.util.Observable} The observable
         * @param {String} eventName The name of the event
         * @param {String} [description] The description of the assertion.
         */
        hasListener : function (observable, eventName, description) {
            if (!observable || !observable.hasListener) {
                this.fail(description, {
                    assertionName       : 'hasListener',
                    annotation          : '1st argument for `t.hasListener` should be an observable instance'
                })
                
                return
            }
            
            if (observable.hasListener(eventName))
                this.pass(description, {
                    descTpl             : 'Observable has listener for {eventName}',
                    eventName           : eventName
                })
            else
                this.fail(description, {
                    assertionName       : 'hasListener',
                    annotation          : 'Provided observable has no listeners for event: ' + eventName
                })
        },


        /**
         * This assertion will verify that the observable fires the specified event and supplies the correct parameters to the listener function.
         * A checker method should be supplied that verifies the arguments passed to the listener function, and then returns true or false depending on the result.
         * If the event was never fired, this assertion fails. If the event is fired multiple times, all events will be checked, but 
         * only one pass/fail message will be reported.
         * 
         * For example:
         * 

    t.isFiredWithSignature(store, 'add', function (store, records, index) {
        return (store instanceof Ext.data.Store) && (records instanceof Array) && t.typeOf(index) == 'Number'
    })
 
         * @param {Ext.util.Observable} observable The observable instance  
         * @param {String} event The name of event
         * @param {Function} checkerFn A method that should verify each argument, and return true or false depending on the result.
         * @param {String} desc The description of the assertion.
         */
        isFiredWithSignature : function(observable, event, checkerFn, description) {
            var eventFired;
            var me              = this;
            var sourceLine      = me.getSourceLine();
            
            var verifyFiredFn = function () {
                observable.un(event, listener);

                if (!eventFired) {
                    me.fail(event + " event was not fired during the test");
                }
            };
            
            me.on('beforetestfinalizeearly', verifyFiredFn);

            var listener = function () { 
                me.un('beforetestfinalizeearly', verifyFiredFn);
                
                var result = checkerFn.apply(me, arguments);

                if (!eventFired && result) {
                    me.pass(description || 'Observable fired ' + event + ' with correct signature', {
                        sourceLine  : sourceLine
                    });
                }

                if (!result) {
                    me.fail(description || 'Observable fired ' + event + ' with incorrect signature', {
                        sourceLine  : sourceLine
                    });
                    
                    // Don't spam the assertion grid with failure, one failure is enough
                    observable.un(event, listener);
                }
                eventFired = true 
            };

            observable.on(event, listener);
        }
    }
});
