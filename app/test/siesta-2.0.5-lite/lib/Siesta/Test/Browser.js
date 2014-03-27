/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.Browser
@extends Siesta.Test
@mixin Siesta.Test.Simulate.Event
@mixin Siesta.Test.TextSelection 
@mixin Siesta.Test.Simulate.Mouse
@mixin Siesta.Test.Simulate.Keyboard


A base class for testing a generic browser functionality. It has various DOM-related assertions, and is not optimized for any framework.

*/
Class('Siesta.Test.Browser', {
    
    isa         : Siesta.Test,
        
    does        :  [ 
        Siesta.Test.Simulate.Event,
        Siesta.Test.Simulate.Mouse,
        Siesta.Test.Simulate.Keyboard,
        Siesta.Test.Element,
        Siesta.Test.TextSelection
    ],

    has : {
        // this will be a shared array instance between all subtests
        // it should not be overwritten, instead modify individual elements:
        // NO: this.currentPosition = [ 1, 2 ]
        // YES: this.currentPosition[ 0 ] = 1
        // YES: this.currentPosition[ 1 ] = 2
        currentPosition         : {
           init : function () { return [ 0, 0 ]; }
        },
        
        forceDOMVisible         : false
    },

    methods : { 
        $ : function () {
            var local$ = $.rebindWindowContext(this.global);
            return local$.apply(this.global, arguments);
        },
        
        
        isEventPrevented : function (event) {
            // our custom property - takes highest priority
            if (this.typeOf(event.$defaultPrevented) == 'Boolean') return event.$defaultPrevented
            
            // W3c standards property
            if (this.typeOf(event.defaultPrevented) == 'Boolean') return event.defaultPrevented
            
            return event.returnValue === false
        },
        
        
        getElementPageRect : function (el, $el) {
            $el             = $el || this.$(el)
            
            var offset      = $el.offset()
            
            return new Siesta.Util.Rect({
                left        : offset.left,
                top         : offset.top,
                width       : $el.outerWidth(),
                height      : $el.outerHeight()
            })
        },
        
        
        elementHasScroller : function (el, $el) {
            $el             = $el || this.$(el)
                
            var hasX        = el.scrollWidth != el.clientWidth && $el.css('overflow-x') != 'visible'
            var hasY        = el.scrollHeight != el.clientHeight && $el.css('overflow-y') != 'visible'
            
            return hasX || hasY ? { x : hasX, y : hasY } : false
        },
        
        
        hasForcedIframe : function () {
            return Boolean(this.forceDOMVisible && (this.scopeProvider instanceof Scope.Provider.IFrame) && this.scopeProvider.iframe)
        },
        
        
        elementIsScrolledOut : function (el, offset) {
            var $el                 = this.$(el)
            
            var scrollableParents   = []
            var parent              = $el
            
            var body                = this.global.document.body
            
            while (parent = parent.parent(), parent.length && parent[ 0 ] != body) {
                var hasScroller     = this.elementHasScroller(parent[ 0 ], parent)
                
                if (hasScroller) scrollableParents.unshift({ hasScroller : hasScroller, $el : parent }) 
            }
            
            var $body               = this.$(body)
            var bodyOffset          = $body.offset()
            
            var currentRect         = new Siesta.Util.Rect({
                left        : bodyOffset.left + $body.scrollLeft(),
                top         : bodyOffset.top + $body.scrollTop(),
                width       : body.clientWidth,
                height      : body.clientHeight
            })
            
            for (var i = 0; i < scrollableParents.length; i++) {
                var hasScroller     = scrollableParents[ i ].hasScroller
                var $parent         = scrollableParents[ i ].$el
                
                if (hasScroller && hasScroller.x)
                    currentRect     = currentRect.cropLeftRight(this.getElementPageRect($parent[ 0 ], $parent))
                    
                if (currentRect.isEmpty()) return true
                    
                if (hasScroller && hasScroller.y)
                    currentRect     = currentRect.cropTopBottom(this.getElementPageRect($parent[ 0 ], $parent))
                    
                if (currentRect.isEmpty()) return true
            }
            
            var elPageRect          = this.getElementPageRect($el[ 0 ], $el)
            var finalRect           = currentRect.intersect(elPageRect)
            
            if (finalRect.isEmpty()) return true
            
            offset                  = this.normalizeOffset(offset, $el)
            
            return !finalRect.contains(elPageRect.left + offset[ 0 ], elPageRect.top + offset[ 1 ])
        },
        
        
        scrollTargetIntoView : function (target, offset) {
            // If element isn't visible, try to bring it into view
            if (this.elementIsScrolledOut(target, offset)) {
                // Required to handle the case where the body is scrolled
                target.scrollIntoView();

                this.$(target).scrollintoview({ duration : 0 });
            }
        },

        
        processSubTestConfig : function () {
            var res             = this.SUPERARG(arguments)
            var me              = this
            
            Joose.A.each([ 
                'currentPosition', 
                'actionDelay', 'afterActionDelay', 
                'dragDelay', 'moveCursorBetweenPoints', 'dragPrecision', 'overEls'
            ], function (name) {
                res[ name ]     = me[ name ]
            })
            
            res.simulateEventsWith  = me.getSimulateEventsWith()
            
            return res
        },
        
        
        // Normalizes the element to an HTML element. Every 'framework layer' will need to provide its own implementation
        // This implementation accepts either a CSS selector or an Array with xy coordinates.
        normalizeElement : function (el, allowMissing, shallow) {
            if (typeof el === 'string') {
                // DOM query
                var origEl  = el;
                el          = this.$(el)[ 0 ];
                
                if (!allowMissing && !el) {
                    this.warn('No DOM element found for CSS selector: ' + origEl)
                    throw 'No DOM element found for CSS selector: ' + origEl;
                }
            }
            
            if (this.valueIsArray(el)) el = this.elementFromPoint(el[0], el[1]);
            
            return el;
        },
        
        
        // this method generally has the same semantic as the "normalizeElement", its being used in 
        // Siesta.Test.Action.Role.HasTarget to determine what to pass to next step
        //
        // on the browser level the only possibility is DOM element
        // but on ExtJS level user can also use ComponentQuery and next step need to receive the 
        // component instance
        normalizeActionTarget : function (el, allowMissing) {
            var result = this.normalizeElement(el, allowMissing);
            
            if (!allowMissing && !result) {
                throw 'No action target found for: ' + el;
            }
            return result;
        },

        
        
        // private
        getPathBetweenPoints: function (from, to) {
            if (
                typeof from[0] !== 'number' ||
                typeof from[1] !== 'number' ||
                typeof to[0] !== 'number'   ||
                typeof to[1] !== 'number'   ||
                isNaN(from[0])              ||
                isNaN(from[1])              ||
                isNaN(to[0])                ||
                isNaN(to[1]))
            {
                throw 'Incorrect arguments passed to getPathBetweenPoints';
            }

            var stops = [],
                x0 = Math.floor(from[0]),
                x1 = Math.floor(to[0]),
                y0 = Math.floor(from[1]),
                y1 = Math.floor(to[1]),
                dx = Math.abs(x1 - x0),
                dy = Math.abs(y1 - y0),
                sx, sy, err, e2;

            if (x0 < x1) {
                sx = 1;
            } else {
                sx = -1;
            }

            if (y0 < y1) {
                sy = 1;
            } else {
                sy = -1;
            }
            err = dx - dy;
            
            while (x0 !== x1 || y0 !== y1) {
                e2 = 2 * err;
                if (e2 > -dy) {
                    err = err - dy;
                    x0 = x0 + sx;
                }

                if (e2 < dx) {
                    err = err + dx;
                    y0 = y0 + sy;
                }
                stops.push([x0, y0]);
            }

            var last = stops[stops.length-1];

            if (stops.length > 0 && (last[0] !== to[0] || last[1] !== to[1])) {
                stops.push(to);
            }
            return stops;
        },

        randomBetween : function (min, max) {
            return Math.round(min + (Math.random()*(max - min)));
        },

        
        // private
        valueIsArray : function(a) {
            return a && (a instanceof Array || a instanceof this.global.Array);
        },
        
        
        /**
         * This method will return the top-most DOM element at the specified coordinates from the test page. If
         * the resulting element is an iframe and `shallow` argument is not passed as `true`
         * it'll query the iframe for its element from the local point inside it.
         * 
         * @param {Number} x The X coordinate
         * @param {Number} y The Y coordinate
         * @param {Boolean} [shallow] Pass `true` to _not_ check the nested iframe if element at original coordinates is an iframe.
         * 
         * @return {HTMLElement} The top-most element at the specified position on the test page
         */
        elementFromPoint : function (x, y, shallow, fallbackEl, fullInfo) {
            var document    = this.global.document;
            var el          = document.elementFromPoint(x, y)
            
            // trying 2nd time if 1st attempt failed and returned null
            // this weird thing seems to be required sometimes for IE8 and may be for IE10
            if (!el) el     = document.elementFromPoint(x, y)
            
            // final fallback to the provided element or to the <body> element
            el              = el || fallbackEl || document.body;
            
            var localX      = x
            var localY      = y

            // If we found IFRAME and its not a `shallow` request, try to dig deeper
            if (el.nodeName.toUpperCase() == 'IFRAME' && !shallow) { 
                // if found iframe is loaded from different domain
                // just accessing its "el.contentWindow.document" property will throw exception
                try {
                    var iframeDoc       = el.contentWindow.document;
                    var offsetsToTop    = this.$(el).offset();
                    
                    localX              = x - offsetsToTop.left
                    localY              = y - offsetsToTop.top
        
                    var resolvedEl      = iframeDoc.elementFromPoint(localX, localY)
        
                    // again weird 2nd attempt for IE
                    if (!resolvedEl) resolvedEl = iframeDoc.elementFromPoint(localX, localY)
                    
                    resolvedEl          = resolvedEl || iframeDoc.body;
        
                    // Chrome reports 'HTML' in nested document.elementFromPoint calls which makes no sense
                    if (resolvedEl.nodeName.toUpperCase() === 'HTML') resolvedEl = iframeDoc.body;
        
                    el                  = resolvedEl;
                } catch (e) {
                    // digging deeper failed, restore the local coordinates
                    localX              = x
                    localY              = y
                }
            }
            
            return fullInfo ? {
                el          : el,
                localXY     : [ localX, localY ],
                globalXY    : [ x, y ]
            } : el
        },
        
        
        activeElement : function (notAllowBody, fallbackEl, elOrDoc) {
            var doc         = elOrDoc ? elOrDoc.ownerDocument || elOrDoc : this.global.document
            
            var focusedEl   = doc.activeElement;

            // For iframes, we need to grab the activeElement of the frame
            if ($(focusedEl).is('iframe') && focusedEl.contentDocument && focusedEl.contentDocument.body) {
                focusedEl = focusedEl.contentDocument.activeElement;
            }
            // 1. In IE10, it seems activeElement cannot be trusted as it sometimes returns an empty object with no properties.
            // Try to detect this case and use the fallback el 
            // 2. Sometimes receiving <body> from this method does not make sense either - use fallback el as well
            else if (!focusedEl || !focusedEl.nodeName || !focusedEl.tagName || (focusedEl === doc.body && notAllowBody)) {
                focusedEl   = fallbackEl;
            }
            
            return focusedEl
        },

        
        /**
         * This method uses native `document.elementFromPoint()` and returns the DOM element under the current logical cursor 
         * position in the test. Note, that this method may work not 100% reliable in IE due to its bugs. In cases
         * when "document.elementFromPoint" can't find any element this method returns the &lt;body&gt; element.
         * 
         * @return {HTMLElement}
         */
        getElementAtCursor : function() {
            var xy          = this.currentPosition;
            
            return this.elementFromPoint(xy[0], xy[1]);
        },

        /**
         * This method will wait for the first browser `event`, fired by the provided `observable` and will then call the provided callback.
         * 
         * @param {Mixed} observable Any browser observable, window object, element instances, CSS selector.
         * @param {String} event The name of the event to wait for
         * @param {Function} callback The callback to call 
         * @param {Object} scope The scope for the callback
         * @param {Number} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForEvent : function (observable, event, callback, scope, timeout) {
            var eventFired      = false
            
            this.$(observable).bind(event, function () { eventFired = true })
            
            return this.waitFor({
                method          : function() { return eventFired; }, 
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForEvent',
                description     : ' observable to fire its "' + event + '" event'
            });
        },
        
        
        addListenerToObservable : function (observable, event, listener) {
            this.$(observable).bind(event, listener)
        },
        
        
        removeListenerFromObservable : function (observable, event, listener) {
            this.$(observable).unbind(event, listener)
        },
        
        
        verifyExpectedNumberOfFiredEvents : function (actual, expected) {
            var operator        = '=='
            
            if (this.typeOf(expected) == 'String') {
                var match       = /([<>=]=?)\s*(\d+)/.exec(expected)
                
                if (!match) throw new Error("Wrong format for expected number of events: " + expected)
                
                operator        = match[ 1 ]
                expected        = Number(match[ 2 ])
            }
            
            switch (operator) {
                case '==' : return actual == expected
                case '<=' : return actual <= expected
                case '>=' : return actual >= expected
                case '<' : return actual < expected
                case '>' : return actual > expected
            }
        },
        

        /**
         * This assertion verifies the number of certain events fired by provided observable instance during provided period.
         * 
         * For example:
         *

    t.firesOk({
        observable      : store,
        events          : {
            { update : 1, add : 2, datachanged : '> 1' }
        },
        during          : function () {
            store.getAt(0).set('Foo', 'Bar');
            
            store.add({ FooBar : 'BazQuix' })
            store.add({ Foo : 'Baz' })
        },
        desc            : 'Correct events fired'
    })
    
    // or
    
    t.firesOk({
        observable      : store,
        events          : {
            { update : 1, add : 2, datachanged : '>= 1' }
        },
        during          : 1
    })
    
    store.getAt(0).set('Foo', 'Bar');
    
    store.add({ FooBar : 'BazQuix' })
    store.add({ Foo : 'Baz' })
    
         *
         * Normally this method accepts a single object with various options (as shown above), but also can be called in 2 additional shortcuts forms:
         * 

    // 1st form for multiple events
    t.firesOk(observable, { event1 : 1, event2 : '>1' }, description)
    
    // 2nd form for single event
    t.firesOk(observable, eventName, 1, description)
    t.firesOk(observable, eventName, '>1', description)

         * 
         * In both forms, `during` is assumed to be undefined and `description` is optional.
         * 
         * @param {Object} options An obect with the following properties:
         * @param {Ext.util.Observable/Ext.Element/HTMLElement} options.observable The observable instance that will fire events
         * @param {Object} options.events The object, properties of which corresponds to event names and values - to expected 
         * number of this event triggering. If value of some property is a number then exact that number of events is expected. If value
         * of some property is a string starting with one of the comparison operators like "\<", "\<=" etc and followed by the number
         * then Siesta will perform that comparison with the number of actualy fired events.
         * @param {Number/Function} [options.during] If provided as a number denotes the number of milliseconds during which
         * this assertion will "record" the events from observable, if provided as function - then this assertion will "record"
         * only events fired during execution of this function. If not provided at all - assertions are recorded until the end of
         * current test (or sub-test)  
         * @param {Function} [options.callback] A callback to call after this assertion has been checked. Only used if `during` value is provided. 
         * @param {String} [options.desc] A description for this assertion
         */
        firesOk: function (options, events, n, timeOut, func, desc, callback) {
            //                    |        backward compat arguments        | 
            var me              = this;
            var sourceLine      = me.getSourceLine();
            
            var observable, during
            
            if (arguments.length == 1) {
                observable      = options.observable
                events          = options.events
                during          = options.during
                desc            = options.desc || options.description
                callback        = options.callback
                
                timeOut         = this.typeOf(during) == 'Number' ? during : null
                func            = this.typeOf(during) == 'Function' ? during : null
                
            } else if (arguments.length >= 5) {
                // old signature, backward compat
                observable      = options
                
                if (this.typeOf(events) == 'String') {
                    var obj         = {}
                    obj[ events ]   = n
                    
                    events          = obj
                }
            } else if (arguments.length <= 3 && this.typeOf(events) == 'Object') {
                // shortcut form 1
                observable      = options
                desc            = n
            } else if (arguments.length <= 4 && this.typeOf(events) == 'String') {
                // shortcut form 2
                observable      = options
                
                var obj         = {}
                obj[ events ]   = n
                events          = obj
                
                desc            = timeOut
                timeOut         = null
            } else
                throw new Error("Unrecognized signature for `firesOk`")
            
            // start recording
            var counters    = {};
            var countFuncs  = {};

            Joose.O.each(events, function (expected, eventName) {
                counters[ eventName ]   = 0
                
                var countFunc   = countFuncs[ eventName ] = function () {
                    counters[ eventName ]++
                }
                
                me.addListenerToObservable(observable, eventName, countFunc);    
            })
            
            
            // stop recording and verify the results
            var stopRecording   = function () {
                Joose.O.each(events, function (expected, eventName) {
                    me.removeListenerFromObservable(observable, eventName, countFuncs[ eventName ]);
                    
                    var actualNumber    = counters[ eventName ]
    
                    if (me.verifyExpectedNumberOfFiredEvents(actualNumber, expected))
                        me.pass(desc, {
                            descTpl         : 'Observable fired ' + actualNumber + ' `' + eventName + '` events'
                        });
                    else
                        me.fail(desc, {
                            assertionName   : 'firesOk',
                            sourceLine      : sourceLine,
                            descTpl         : 'Observable fired expected number of `' + eventName + '` events',
                            got             : actualNumber,
                            gotDesc         : 'Actual number of events',
                            need            : expected,
                            needDesc        : 'Expected number of events'
                        });
                })
            }
            
            if (timeOut) {
                var async               = this.beginAsync(timeOut + 100);
                
                var originalSetTimeout  = this.originalSetTimeout;
    
                originalSetTimeout(function () {
                    me.endAsync(async);
                    
                    stopRecording()
    
                    callback && me.processCallbackFromTest(callback);
                }, timeOut);
            } else if (func) {
                func()
                
                stopRecording()
                
                callback && me.processCallbackFromTest(callback)
            } else {
                this.on('beforetestfinalizeearly', stopRecording)
            }
        },


        /**
         * This assertion passes if the observable fires the specified event exactly (n) times during the test execution.
         * Please note that
         *
         * @param {Ext.util.Observable/Ext.Element/HTMLElement} observable The observable instance
         * @param {String} event The name of event
         * @param {Number} n The expected number of events to be fired
         * @param {String} desc The description of the assertion.
         */
        willFireNTimes: function (observable, event, n, desc, isGreaterEqual) {
            this.firesOk(observable, event, isGreaterEqual ? '>=' + n : n, desc)
        },
        
        
        getObjectWithExpectedEvents : function (event, expected) {
            var events      = {}
            
            if (this.typeOf(event) == 'Array') 
                Joose.A.each(event, function (eventName) {
                    events[ eventName ] = expected
                })
            else
                events[ event ]         = expected
                
            return events
        },
        
        
        /**
         * This assertion passes if the observable does not fire the specified event(s) after calling this method.
         * 
         * @param {Mixed} observable Any browser observable, window object, element instances, CSS selector.
         * @param {String/Array[String]} event The name of event or array of such
         * @param {String} desc The description of the assertion.
         */
        wontFire : function(observable, event, desc) {
            this.firesOk({
                observable      : observable,
                events          : this.getObjectWithExpectedEvents(event, 0), 
                desc            : desc
            });
        },

        /**
         * This assertion passes if the observable fires the specified event exactly once after calling this method.
         * 
         * @param {Mixed} observable Any browser observable, window object, element instances, CSS selector.
         * @param {String/Array[String]} event The name of event or array of such
         * @param {String} desc The description of the assertion.
         */
        firesOnce : function(observable, event, desc) {
            this.firesOk({
                observable      : observable,
                events          : this.getObjectWithExpectedEvents(event, 1), 
                desc            : desc
            });
        },

        /**
         * Alias for {@link #wontFire} method
         * 
         * @param {Mixed} observable Any browser observable, window object, element instances, CSS selector.
         * @param {String/Array[String]} event The name of event or array of such
         * @param {String} desc The description of the assertion.
         */
        isntFired : function() {
            this.wontFire.apply(this, arguments);
        },

        /**
         * This assertion passes if the observable fires the specified event at least `n` times after calling this method.
         * 
         * @param {Mixed} observable Any browser observable, window object, element instances, CSS selector.
         * @param {String} event The name of event
         * @param {Number} n The minimum number of events to be fired
         * @param {String} desc The description of the assertion.
         */
        firesAtLeastNTimes : function(observable, event, n, desc) {
            this.firesOk(observable, event, '>=' + n, desc);
        },


        // This method accepts actionTargets as input (Dom node, string, CQ etc) and does a first normalization pass to get a DOM element.
        // After initial normalization it also tries to locate, the 'top' DOM node at the center of the first pass resulting DOM node.
        // This is the only element we can truly interact with in a real browser.
        // returns an object containing the element plus coordinates
        getNormalizedTopElementInfo : function (actionTarget, skipWarning, actionName, offset) {
            var localXY, globalXY, el;

            actionTarget    = actionTarget || this.currentPosition;

            // First lets get a normal DOM element to work with
            if (this.valueIsArray(actionTarget)) {
                globalXY    = actionTarget;
                
                var info    = this.elementFromPoint(actionTarget[ 0 ], actionTarget[ 1 ], false, null, true);
                
                el          = info.el
                localXY     = info.localXY
            } else {
                el          = this.normalizeElement(actionTarget, skipWarning, Boolean(offset));
            }

            if (!el && skipWarning) {
                return;
            }

            // 1. If this element is not visible, something is wrong
            // 2. If element is visible but not reachable (scrolled out of view) this is also an invalid scenario (this check is skipped for IE)
            //    TODO needs further investigation, conflicting with starting a drag operation on an element that isn't visible until the cursor is above it
            if (!skipWarning && (!this.isElementVisible(el) /* || (!$.browser.msie && !this.elementIsTop(el, true))*/ )) {
                this.fail('findTopDomElement: ' + (actionName ? "Target element of action [" + actionName + "]" : "Target element of some action") +
                        " is not visible or not reachable: " + (el.id ? '#' + el.id : el)
                );
            }

            if (!this.valueIsArray(actionTarget)) {
                var doc     = el.ownerDocument;

                localXY     = this.getTargetCoordinate(el, true, offset)
                globalXY    = this.getTargetCoordinate(el, false, offset)

                // trying 2 times for IE
                el          = doc.elementFromPoint(localXY[ 0 ], localXY[ 1 ]) || doc.elementFromPoint(localXY[ 0 ], localXY[ 1 ]) || doc.body;

                if (!el) {
                    this.fail('findTopDomElement: Could not find any element at [' + localXY + ']');
                    return; // No point going further
                }
            }

            return {
                el          : el,
                localXY     : localXY,
                globalXY    : globalXY
            }
        },

        /**
         * This method will wait for the presence of the passed string.
         *
         * @param {String} text The text to wait for
         * @param {Function} callback The callback to call
         * @param {Object} scope The scope for the callback
         * @param {Number} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForTextPresent : function (text, callback, scope, timeout) {

            return this.waitFor({
                method          : function() { return this.$(':contains(' + text + ')').length > 0; },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForTextPresent',
                description     : ' text "' + text + '" to be present'
            });
        },

        /**
         * This method will wait for the absence of the passed string.
         *
         * @param {String} text The text to wait for
         * @param {Function} callback The callback to call
         * @param {Object} scope The scope for the callback
         * @param {Number} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForTextNotPresent : function (text, callback, scope, timeout) {

            return this.waitFor({
                method          : function() { return this.$(':contains(' + text + ')').length === 0; },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForTextNotPresent',
                description     : ' text "' + text + '" to not be present'
            });
        },

        /**
         * Waits until the passed action target is detected. This can be a string such as a component query, CSS query or a composite query.
         *
         * @param {String/Siesta.Test.ActionTarget} target The target presence to wait for
         * @param {Function} callback The callback to call after the target has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForTarget : function(target, callback, scope, timeout) {
            var me = this;

            this.waitFor({
                method          : function() { return me.normalizeElement(target, true); },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForTarget',
                description     : ' target "' + target + '" appear'
            });
        }
    }
});
