/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.SenchaTouch
@extends Siesta.Test.Browser
@mixin Siesta.Test.ExtJSCore
@mixin Siesta.Test.ExtJS.Observable
@mixin Siesta.Test.ExtJS.FormField
@mixin Siesta.Test.ExtJS.Component
@mixin Siesta.Test.ExtJS.Element 
@mixin Siesta.Test.ExtJS.Store 

A base class for testing Sencha Touch applications. It inherits from {@link Siesta.Test.Browser} 
and adds various ST specific assertions.

This file is a reference only, for a getting start guide and manual, please refer to <a href="#!/guide/siesta_getting_started">Getting Started Guide</a>.

*/
Class('Siesta.Test.SenchaTouch', {
    
    isa         : Siesta.Test.Browser,
        
    does        :  [ 
        Siesta.Test.ExtJSCore, 
        Siesta.Test.ExtJS.Component, 
        Siesta.Test.ExtJS.Element, 
        Siesta.Test.ExtJS.Observable, 
        Siesta.Test.ExtJS.Store,
		Siesta.Test.ExtJS.Ajax
    ],
    
    has         : {
        performSetup        : true,
        isSTSetupDone       : false,

        moveCursorBetweenPoints : false
    },
    
    override : {
        
        isReady : function () {
            var result = this.SUPERARG(arguments);

            if (!result.ready) return result;

            if (!this.parent && this.performSetup && !this.isSTSetupDone) return {
                ready       : false,
                reason      : "Waiting for Ext.setup took too long - some dependency can't be loaded? Check the `Net` tab in Firebug"
            }
            
            return {
                ready       : true
            }
        },

        
        start : function () {
            var me      = this;
            var Ext     = this.getExt();
            
            if (!Ext) return
            
            // calling SUPER to setup the loader paths, Ext.setup() will already do Ext.require
            this.SUPERARG(arguments)
            
            // execute "Ext.setup()" for top-level tests only 
            if (this.performSetup && !this.parent) Ext.setup({
                onReady : function () {
                    me.isSTSetupDone    = true
                }
            })
        },
        
        
        launch : function () {
            var setupEventTranslation = function () {
                if (Ext.feature.has.Touch) {
                    if (Ext.getVersion('touch').isGreaterThanOrEqual('2.2.0')) {
                        Ext.event.publisher.TouchGesture.prototype.handledEvents.push('mousedown', 'mousemove', 'mouseup');
                    } else {
                        Ext.event.publisher.TouchGesture.override({
                            moveEventName: 'mousemove',

                            map: {
                                mouseToTouch: {
                                    mousedown: 'touchstart',
                                    mousemove: 'touchmove',
                                    mouseup: 'touchend'
                                },

                                touchToMouse: {
                                    touchstart: 'mousedown',
                                    touchmove: 'mousemove',
                                    touchend: 'mouseup'
                                }
                            },

                            attachListener: function(eventName) {
                                eventName = this.map.touchToMouse[eventName];

                                if (!eventName) {
                                    return;
                                }

                                return this.callOverridden([eventName]);
                            },

                            lastEventType: null,

                            onEvent: function(e) {
                                if ('button' in e && e.button !== 0) {
                                    return;
                                }

                                var type = e.type,
                                    touchList = [e];

                                // Temporary fix for a recent Chrome bugs where events don't seem to bubble up to document
                                // when the element is being animated
                                // with webkit-transition (2 mousedowns without any mouseup)
                                if (type === 'mousedown' && this.lastEventType && this.lastEventType !== 'mouseup') {
                                    var fixedEvent = document.createEvent("MouseEvent");
                                        fixedEvent.initMouseEvent('mouseup', e.bubbles, e.cancelable,
                                            document.defaultView, e.detail, e.screenX, e.screenY, e.clientX,
                                            e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.metaKey,
                                            e.button, e.relatedTarget);

                                    this.onEvent(fixedEvent);
                                }

                                if (type !== 'mousemove') {
                                    this.lastEventType = type;
                                }

                                e.identifier = 1;
                                e.touches = (type !== 'mouseup') ? touchList : [];
                                e.targetTouches = (type !== 'mouseup') ? touchList : [];
                                e.changedTouches = touchList;

                                return this.callOverridden([e]);
                            },

                            processEvent: function(e) {
                                this.eventProcessors[this.map.mouseToTouch[e.type]].call(this, e);
                            }
                        });
                    }
                }
            };

            // Need to tell ST to convert mouse events to their touch counterpart
            this.scopeProvider.runCode('(' + setupEventTranslation.toString() + ')();')
            
            this.SUPERARG(arguments)
        }
    },
    
    methods : {
        // one of these methods feels redundant
        getTouchBundlePath : function() {
            var path;
            var testDescriptor      = this.harness.getScriptDescriptor(this.url)
            
            while (testDescriptor && !path) {
                if (testDescriptor.preload) {
                    Joose.A.each(testDescriptor.preload, function (url) {
                        if (url.match && url.match(/(.*sencha-touch-\d\.\d+\.\d+.*?)\/sencha-touch(.*)\.js/)) {
                            path = url;
                            return false;
                        }
                    });
                }
                testDescriptor = testDescriptor.parent;
            }

            return path;
        },


        getTouchBundleFolder : function() {
            var folder;
            var testDescriptor      = this.harness.getScriptDescriptor(this.url)

            while (testDescriptor && !folder) {
                if (testDescriptor.preload) {
                    Joose.A.each(testDescriptor.preload, function (url) {
                        var regex = /(.*sencha-touch-\d\.\d+\.\d+.*?)\/sencha-touch(.*)\.js/;
                        var match = regex.exec(url);
                
                        if (match) {
                           folder = match[1];
                        }
                    });
                }
                testDescriptor = testDescriptor.parent;
            }

            return folder;
        },
        
        
        getExtBundleFolder : function() {
            var folder;

            this.harness.mainPreset.eachResource(function (resource) {
                var desc = resource.asDescriptor();
                
                var regex = /(.*sencha-touch-\d\.\d+\.\d+.*?)\/sencha-touch-all(?:-debug)?\.js/;
                var match = regex.exec(desc.url);
                
                if (match) {
                   folder = match[1];
                }
            });

            return folder;
        },
        

        /**
         * This method taps the passed target, which can be of several different types, see {@link Siesta.Test.ActionTarget}
         * 
         * @param {Siesta.Test.ActionTarget} target Target for this action
         * @param {Function} callback (optional) A function to call after action.
         * @param {Object} scope (optional) The scope for the callback
         * @param {Array} offset (optional) An X,Y offset relative to the target. Example: [20, 20] for 20px or ["50%", "50%"] to click in the center.
         */
        tap: function (target, callback, scope, offset) {
            var me      = this;
            var context = this.getNormalizedTopElementInfo(target, true, 'tap', offset);

            if (!context) {
                this.waitForTarget(target, function() {
                    this.tap(target, callback, scope, offset);
                }, this);

                return;
            }

            var queue       = new Siesta.Util.Queue({
                deferer         : this.originalSetTimeout,
                deferClearer    : this.originalClearTimeout,
                
                interval        : callback ? 30 : 0,
                
                observeTest     : this,
                
                processor       : function (data) {
                    me.simulateEvent.apply(me, data);
                }
            })
            
            queue.addStep([ context.localXY, "mousedown", {}, false ])
            queue.addStep([ context.localXY, "mouseup", {}, true ])

            var async   = me.beginAsync();
            
            queue.run(function () {
                me.endAsync(async);
                
                me.processCallbackFromTest(callback, null, scope || me)
            })
        },

        /**
         * This method double taps the passed target, which can be of several different types, see {@link Siesta.Test.ActionTarget}
         * 
         * @param {Siesta.Test.ActionTarget} target Target for this action
         * @param {Function} callback (optional) A function to call after action
         * @param {Object} scope (optional) The scope for the callback
         * @param {Array} offset (optional) An X,Y offset relative to the target. Example: [20, 20] for 20px or ["50%", "50%"] to click in the center.
         */
        doubleTap: function (target, callback, scope, offset) {
            var me          = this;

            var context = this.getNormalizedTopElementInfo(target, true, 'doubleTap', offset);

            if (!context) {
                this.waitForTarget(target, function() {
                    this.doubleTap(target, callback, scope, offset);
                }, this);

                return;
            }

            target = context.localXY;

            var queue       = new Siesta.Util.Queue({
                deferer         : this.originalSetTimeout,
                deferClearer    : this.originalClearTimeout,
                
                interval        : callback ? 30 : 0,
                
                observeTest     : this,
                
                processor       : function (data) {
                    me.simulateEvent.apply(me, data);   
                }
            })
            
            queue.addStep([ target, "mousedown", {}, false ])
            queue.addStep([ target, "mouseup", {}, true ])
            
            queue.addStep([ target, "mousedown", {}, false ])
            queue.addStep([ target, "mouseup", {}, true ])
            
            var async   = me.beginAsync();
            
            queue.run(function () {
                me.endAsync(async);
                
                me.processCallbackFromTest(callback, null, scope || me)
            })
        },

        /**
         * This method performs a long press on the passed target, which can be of several different types, see {@link Siesta.Test.ActionTarget}
         * 
         * @param {Siesta.Test.ActionTarget} target Target for this action
         * @param {Function} callback (optional) A function to call after action
         * @param {Object} scope (optional) The scope for the callback
         * @param {Array} offset (optional) An X,Y offset relative to the target. Example: [20, 20] for 20px or ["50%", "50%"] to click in the center.
         */
        longpress: function (target, callback, scope, offset) {
            var Ext = this.Ext();
            var me = this;

            var context = this.getNormalizedTopElementInfo(target, true, 'longpress', offset);

            if (!context) {
                this.waitForTarget(target, function() {
                    this.longpress(target, callback, scope, offset);
                }, this);

                return;
            }
            target = context.localXY;

            var amount = Ext.event.recognizer.LongPress.prototype.config.minDuration + 50;

            var queue       = new Siesta.Util.Queue({
                deferer         : this.originalSetTimeout,
                deferClearer    : this.originalClearTimeout,

                interval        : callback ? 30 : 0,

                observeTest     : this,

                processor       : function (data) {
                    me.simulateEvent.apply(me, data);
                }
            })

            queue.addStep([ target, "mousedown", {} ])
            queue.addDelayStep(amount);
            queue.addStep([ target, "mouseup", {} ])

            var async   = me.beginAsync();

            queue.run(function () {
                me.endAsync(async);

                me.processCallbackFromTest(callback, null, scope || me)
            })
        },

        /**
        * This method will simulate a swipe operation between either two points or on a single DOM element.
        *   
        * @param {Siesta.Test.ActionTarget} target Target for this action
        * @param {String} direction Either 'left', 'right', 'up' or 'down'
        * @param {Function} callback (optional) To run this method async, provide a callback method to be called after the drag operation is completed.
        * @param {Object} scope (optional) the scope for the callback
        */
        swipe : function(target, direction, callback, scope) {
            target = this.normalizeElement(target, true);

            if (!target) {
                this.waitForTarget(target, function() {
                    this.swipe(target, direction, callback, scope);
                }, this);

                return;
            }

            var Ext = this.Ext();
            
            var box = Ext.fly(target).getBox(),
                start,
                end,
                edgeOffsetRatio = 10;
            
            // Since this method accepts elements as target, we need to assure that we swipe at least about 150px
            // using Math.max below etc

            switch(direction) {
                case 'u':
                case 'up':
                    start   = [box.x + box.width/2, (box.y + box.height*9/edgeOffsetRatio)];
                    end     = [box.x + box.width/2, box.y + box.height/edgeOffsetRatio]; 
                    
                    end[1] = Math.min(start[1] - 100, end[1]);
                break;

                case 'd':
                case 'down':
                    start   = [box.x + box.width/2, (box.y + box.height/edgeOffsetRatio)]; 
                    end     = [box.x + box.width/2, (box.y + box.height*9/edgeOffsetRatio)];

                    end[1] = Math.max(start[1] + 100, end[1]);
                break;

                case 'r':
                case 'right':
                    start   = [box.x + (box.width /edgeOffsetRatio), (box.y + box.height/2)]; 
                    end     = [box.x + (box.width * 9/edgeOffsetRatio), (box.y + box.height/2)];
                    
                    end[0] = Math.max(start[0] + 100, end[0]);
                break;

                case 'l':
                case 'left':
                    start   = [box.x + (box.width * 9/edgeOffsetRatio), (box.y + box.height/2)];
                    end     = [box.x + (box.width /edgeOffsetRatio), (box.y + box.height/2)]; 
                    
                    end[0] = Math.min(start[0] - 100, end[0]);
                break;

                default: 
                    throw 'Invalid swipe direction: ' + direction;
            }

            this.dragTo(start, end, callback, scope);
        },

        /**
        * This method will simulate a finger move to an xy-coordinate or an element (the center of it)
        * 
        * @param {Siesta.Test.ActionTarget} target Target point to move the finger to.
        * @param {Function} callback (optional) To run this method async, provide a callback method to be called after the operation is completed.
        * @param {Object} scope (optional) the scope for the callback
        * @param {Array} offset (optional) An X,Y offset relative to the target. Example: [20, 20] for 20px or ["50%", "50%"] to click in the center.
         */
        moveFingerTo : function(target, callback, scope, offset) {
            this.moveCursorTo.apply(this, arguments);
        },

        /**
        * This method will simulate a finger move from current position relative by the x and y distances provided.
        * 
        * @param {Array} delta The delta offset to move the finger by.
        * @param {Function} callback (optional) To run this method async, provide a callback method to be called after the operation is completed.
        * @param {Object} scope (optional) the scope for the callback
        */
        moveFingerBy : function(delta, callback, scope) {
            if (!delta) {
                throw 'Trying to call moveFingerBy without relative distances';
            }

            this.moveCursorBy.apply(this, arguments);
        },

//        /**
//        * This method will simulate a swipe operation between either two points or on a single DOM element.
//        *   
//        * @param {Siesta.Test.ActionTarget} source The drag start point as one of the {@link Siesta.Test.ActionTarget} values.
//        * @param {Siesta.Test.ActionTarget} target The drag end point as one of the {@link Siesta.Test.ActionTarget} values.
//        * @param {Function} callback (optional) To run this method async, provide a callback method to be called after the swipe operation is completed.
//        * @param {Object} scope (optional) the scope for the callback
//        */
//        swipeTo : function(source, target, callback, scope) {
//            source = this.normalizeElement(source);
//            target = this.normalizeElement(target);
//
//            this.SUPER(source, target, callback, scope, options, dragOnly);
//        },

//        /**
//        * This method will do something
//        *   
//        * @param {Ext.Component/String/HTMLElement/Array} target Either an Ext.Component, a Component Query selector, an element, or [x,y] as the drag end point
//        * @param {String} direction Either 'left', 'right', 'up' or 'down'
//        * @param {Function} callback (optional) To run this method async, provide a callback method to be called after the drag operation is completed.
//        * @param {Object} scope (optional) the scope for the callback
//        */
        scrollUntil : function(target, direction, checkerFn, callback, scope) {
            var me = this,
                startDate = new Date(),
                dir = direction;

            // Invert direction, Scroll up => Swipe down
            switch(dir) {
                case 'u':
                case 'up':
                    direction = 'down';
                break;

                case 'd':
                case 'down':
                    direction = 'up';
                break;

                case 'l':
                case 'left':
                    direction = 'right';
                break;

                case 'r':
                case 'right':
                    direction = 'left';
                break;

                default: 
                    throw 'Invalid swipe direction: ' + direction;
            }

            var inner = function() {
                if (checkerFn.call(scope || me, target)) {
                    // We're done
                    me.processCallbackFromTest(callback, null, scope || me)
                } else {
                    me.swipe(target, direction, function() { 

                        if (new Date() - startDate < this.waitForTimeout) {
                            var as = me.beginAsync();
                            setTimeout(function() {
                                me.endAsync(as); 
                                inner(); 
                            }, 1000); 
                        } else {
                            me.fail('scrollUntil failed to achieve its mission');
                        }
                    });
                }
            };

            inner();
        },

        /**
         * Waits until the supplied x&y scroll property has the passed value. You can test for either x or y, or both.
         *
         * @param {Ext.scroller.Scroller} scrollable The scroller instance
         * @param {String} direction 'up', 'down', 'left' or 'right'
         * @param {Siesta.Test.ActionTarget} actionTarget The target, either an element or a CSS selector normally.
         * @param {Function} callback The callback to call
         * @param {Object} scope The scope for the callback
         */
        scrollUntilElementVisible : function(scrollable, direction, actionTarget, callback, scope) {
            var me = this;
            if (!actionTarget || !scrollable) {
                this.fail('scrollUntilElementVisible: target or scrollable not provided');
                return;
            }

            this.scrollUntil(scrollable, direction, function() {
                var element = me.normalizeElement(actionTarget, true);
                return me.elementIsInView(element);
            },
            callback, scope);
        },

        
        /**
         * Waits until the supplied x&y scroll property has the passed value. You can test for either x or y, or both.
         * 
         * @param {Ext.scroller.Scroller} scroller The scroller instance
         * @param {Object} position An object with an x, y, or x&y values. Ex. { x : 0 } or { x : 0, y : 200 }.
         * @param {Int} value
         * @param {Function} callback The callback to call
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. 
         */
        waitForScrollerPosition: function(scroller, pos, callback, scope, timeout) {
            this.waitFor({
                method          : function() { 
                    return (!('x' in pos) || pos.x === scroller.position.x) && (!('y' in pos) || pos.y === scroller.position.y);
                }, 
                callback        : callback,
                scope           : scope, 
                timeout         : timeout,
                assertionName   : 'waitForScrollerPosition',
                description     : ' scroller to reach position "' + Siesta.Util.Serializer.stringify(pos)
            });
        },

        /**
         * Waits until no ongoing animations can be detected.
         *
         * @param {Function} callback The callback to call after the component becomes visible
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForAnimations: function (callback, scope, timeout) {
            var Ext = this.Ext();

            this.waitFor({
                method          : function () { return !Ext.AnimationQueue.isRunning; },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForAnimations',
                description     : ' animations to finalize'
            });
        }
    }
})
