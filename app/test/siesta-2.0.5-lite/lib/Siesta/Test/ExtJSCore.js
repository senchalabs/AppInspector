/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 * 
@class Siesta.Test.ExtJSCore

A base mixin for testing ExtJS and SenchaTouch applications. 

Contains testing functionality that is common for both frameworks.

This file is a reference only, for a getting start guide and manual, please refer to <a href="#!/guide/siesta_getting_started">Getting Started Guide</a>.

*/
Role('Siesta.Test.ExtJSCore', {
    
    has : {
        waitForExtReady         : true,
        waitForAppReady         : false,
        loaderPath              : null,
        
        simulateEventsWith      : {
            is      : 'rw',
            lazy    : function () {
                var isIE9           = navigator.userAgent.match(/MSIE 9.0;/)
                var Ext             = this.getExt()
                // the "Ext.getVersion('extjs')" is just "true" in Ext3? (when testing SA)
                var isBelowExt421   = Boolean(Ext && (!Ext.getVersion || Ext.getVersion('extjs') && Ext.getVersion('extjs').isLessThan && Ext.getVersion('extjs').isLessThan('4.2.1.883')))
                
                var div             = document.createElement('div')
                
                return div.attachEvent && (isIE9 || isBelowExt421) ? 'fireEvent' : 'dispatchEvent'
            }
        },
        
        isExtOnReadyDone        : false,
        onReadyWaitingStarted   : false,
        isAppReadyDone          : false
    },

    override : {
        
        processSubTestConfig : function () {
            var res                 = this.SUPERARG(arguments)
            
            // sub tests should not wait for Ext.onReady or for application launch
            res.waitForAppReady     = false
            res.waitForExtReady     = false 
            
            return res
        },
        
        
        isReady : function() {
            var result      = this.SUPERARG(arguments);

            if (!result.ready) return result;
            
            var Ext         = this.getExt();
            
            if (this.waitForExtReady && !this.onReadyWaitingStarted && Ext && Ext.onReady) {
                this.onReadyWaitingStarted  = true
                
                var me      = this
                
                Ext.onReady(function () {
                    me.isExtOnReadyDone     = true
                })
            }
            

            if (this.waitForExtReady && !this.isExtOnReadyDone) return {
                ready       : false,
                reason      : "Waiting for Ext.onReady took too long - some dependency can't be loaded? \nCheck the `Net` tab in Firebug"
            }
            
            if (this.waitForAppReady && !this.isAppReadyDone) return {
                ready       : false,
                reason      : "Waiting for MVC application launch took too long - no MVC application on test page? \nYou may need to disable the `waitForAppReady` config option."
            }
            
            return {
                ready       : true
            }
        },

        // Overridden to deal with the different event firing mechanisms in Ext JS 3 vs 4
        // This code is required because in IE events are simulated using fireEvent instead of dispatchEvent and it seems fireEvent will
        // will not update a checkbox 'checked' state properly so we're forcing the toggle to solve this situation. 
        // This issue is only relevant in IE + Ext. 
        //
        // Test case: 507_form_checkbox.t.js
        simulateMouseClick: function (clickInfo, callback, scope, options) {
            var el      = clickInfo.el
            
            // Force check toggle for input checkboxes
            if (this.getSimulateEventsWith() === 'fireEvent' && (el.type === 'checkbox' || el.type === 'radio') && !el.disabled && !el.readOnly) {
                var oldState = el.checked;

                if (callback) {
                    this.SUPER(el, function (finalClickTarget) { 
                        if (finalClickTarget == el && el.checked === oldState) {
                            el.checked = !oldState;
                        }
                        callback.call(scope || this, finalClickTarget);
                    });
                } else {
                    this.SUPERARG(arguments);

                    if (el.checked === oldState) {
                        el.checked = !oldState;
                    }
                }
            } else {
                this.SUPERARG(arguments);
            }
        }
    },

    methods : {
        
        initialize : function() {
            // Since this test is preloading Ext JS, we should let Siesta know what to 'expect'
            this.expectGlobals('Ext', 'id');
            this.SUPER();
        },
        
        
        start : function (alreadyFailedWithException) {
            var me      = this;
            var Ext     = this.getExt();
            
            if (!Ext) {
                // proceed to parent implementation disabling our "can start" checkers 
                this.waitForAppReady    = false
                this.waitForExtReady    = false
                
                this.SUPERARG(arguments)
                
                return
            }

            // install a "loader path hook" 
            this.harness.generateLoaderPathHook()(this.global.StartTest, Ext, this.loaderPath)
            
            // the actual waiting for Ext.onReady will happen inside of `isReady` method
            // this is because in microloaded touch apps, Ext.onReady may appear with some arbitrary delay

            
            // this flag will explain to Ext, that DOM ready event has already happened
            // Ext fails to set this flag if it was loaded dynamically, already after DOM ready
            // the test will start only after DOM ready anyway, so we just set this flag  
            Ext.isReady         = true

            var canWaitForApp   = Ext.ClassManager && Boolean(Ext.ClassManager.get('Ext.app.Application'))
            
            if (!canWaitForApp) this.waitForAppReady = false
                
            if (this.waitForAppReady && canWaitForApp)
                Ext.util.Observable.observe(Ext.app.Application, {
                    launch      : function () {
                        me.isAppReadyDone   = true
                    },
                    
                    single      : true,
                    delay       : 100
                })
            
            this.SUPERARG(arguments)
        },

        /**
         * This method returns the `Ext` object from the scope of the test. When creating your own assertions for Ext JS code, you need
         * to make sure you are using this method to get the `Ext` instance. Otherwise, you'll be using the same "top-level" `Ext`
         * instance, used by the harness for its UI. 
         * 
         * For example:
         * 
         *      elementHasProvidedCssClass : function (el, cls, desc) {
         *          var Ext     = this.getExt();
         *          
         *          if (Ext.fly(el).hasCls(cls)) {
         *              this.pass(desc);
         *          } else {
         *              this.fail(desc);
         *          }
         *      }
         *   
         * @return {Object} The `Ext` object from the scope of test
         */
        getExt : function () {
            return this.global.Ext
        },
        
        
        /**
         * The alias for {@link #getExt}
         * @method
         */
        Ext : function () {
            return this.global.Ext
        },
        
        
        isExtJSComponent : function (obj) {
            var Ext     = this.getExt()
            
            return Boolean(Ext && Ext.Component && obj instanceof Ext.Component)
        },
        
        // Accepts Ext.Component or ComponentQuery
        normalizeComponent : function(component, allowEmpty) {
            var Ext = this.Ext();

            if (typeof component === 'string') {
                var result = Ext.ComponentQuery.query(component);
                
                if (!allowEmpty && result.length < 1)   this.warn('Your component query: ' + component + ' returned no components.');
                if (result.length > 1)   this.warn('Your component query: ' + component + ' returned more than 1 component.');
                
                component = result[ 0 ];
            }            

            return component;
        },

        /**
         * @private
         * @param {Ext.Component} comp the Ext.Component
         * @param {Boolean} locateInputEl For form fields, try to find the inner input element by default.
         *                  If you want to target the containing Component element, pass false instead.
         * @return {*}
         */
        compToEl : function (comp, locateInputEl) {
            var Ext = this.Ext();

            if (!comp) return null

            locateInputEl = locateInputEl !== false;

            // Ext JS
            if (Ext && Ext.form && Ext.form.Field && locateInputEl) {
                if (comp instanceof Ext.form.Field && comp.inputEl) {
                    return comp.inputEl.dom || comp.inputEl;
                }

                if (Ext.form.HtmlEditor && comp instanceof Ext.form.HtmlEditor) {
                    //     Ext JS 3       Ext JS 4
                    return comp.iframe || comp.inputEl;
                }
            }

            // Sencha Touch: Form fields can have a child input component
            if (Ext && Ext.field && Ext.field.Field && comp instanceof Ext.field.Field && locateInputEl) {
                comp = comp.getComponent();
            }

            //     Ext JS                             vs Sencha Touch
            return comp.getEl ? comp.getEl() : comp.el || comp.element;
        },

        // Accept Ext.Element and Ext.Component
        // If the 'shallow' flag is true we should not 'reevaluate' the target element - stop at the component element.
        normalizeElement : function(el, allowMissing, shallow) {
            if (!el) return null
            
            var Ext     = this.getExt();

            var origEl  = el;

            if (typeof el === 'string') {
                if (el.match(/=>/))
                    // Composite query
                    el      = this.compositeQuery(el, null, allowMissing)[ 0 ]
                else if (el.match(/^\s*>>/)) {
                    // Component query
                    el      = this.cq1(el.substring(2))
                } else {
                    // string in  unknown format, guessing its a DOM query
                    return this.SUPER(el, allowMissing)
                }

                if (!allowMissing && !el) {
                    this.warn('No component found for CQ: ' + origEl)
                    throw 'No component found for CQ: ' + origEl;
                }
            }

            if (this.isExtJSComponent(el)) {
                el          = this.compToEl(el);

                if (!shallow && this.isElementVisible(el) && this.elementIsTop(el, true)) {
                    var center  = this.findCenter(el);

                    el          = this.elementFromPoint(center[0], center[1], false, el.dom);
                }
            }

            // ExtJS Element
            if (el && el.dom) return el.dom
                
            // will also handle the case of conversion of array with coordinates to el 
            return this.SUPER(el, allowMissing, shallow);
        },
        
        
        // this method generally has the same semantic as the "normalizeElement", it's being used in
        // Siesta.Test.Action.Role.HasTarget to determine what to pass to the next step
        //
        // on the browser level the only possibility is DOM element
        // but on ExtJS level user can also use ComponentQuery and next step need to receive the 
        // component instance
        normalizeActionTarget : function (el, allowMissing) {
            if (typeof el === 'string') {
                if (el.match(/^\s*>>/)) {
                    // Component query
                    var result = this.cq1(el.substring(2));

                    if (!result && !allowMissing) {
                        this.warn('No component found for CQ: ' + el)
                        throw 'No component found found for CQ: ' + el;
                    }
                    return result;
                }
            }
            
            var Ext = this.getExt();
            
            // if user has passed ExtJS Component, return it as is
            if (this.isExtJSComponent(el)) return el
            
            // if user has passed ExtJS Element, return it as is
            if (el && el.dom) return el

            return this.SUPER(el, allowMissing)
        },

         /**
         * This method allow assertions to fail silently for tests executed in versions of Ext JS up to a certain release. When you try to run this test on a newer
         * version of Ext JS and it fails, it will fail properly and force you to re-investigate. If it passes in the newer version, you should remove the 
         * use of this method.
         * 
         * See also {@link Siesta.Test#todo}
         *   
         * @param {String} frameworkVersion The Ext JS framework version, e.g. '4.0.7'
         * @param {Function} fn The method covering the broken functionality
         * @param {String} reason The reason or explanation of the bug
        */
        knownBugIn : function(frameworkVersion, fn, reason) {
            var Ext = this.getExt();
            var version = Ext.versions.extjs || Ext.versions.touch;

            if (this.harness.failKnownBugIn || version.isGreaterThan(frameworkVersion)) {
                fn.call(this.global, this);
            } else {
                this.todo('Known bug in ' + frameworkVersion + ': ' + (reason || ''), fn);
            }
        },
        
        
         /**
         * This method will load the specified classes with `Ext.require()` and call the provided callback. Additionally it will check that all classes have been loaded.
         * 
         * This method accepts either variable number of arguments:
         *
         *      t.requireOk('Some.Class1', 'Some.Class2', function () { ... })
         * or array of class names:
         * 
         *      t.requireOk([ 'Some.Class1', 'Some.Class2' ], function () { ... })
         * 
         * @param {String} className1 The name of the class to `require`
         * @param {String} className2 The name of the class to `require`
         * @param {String} classNameN The name of the class to `require`
         * @param {Function} fn The callback. Will be called even if the loading of some classes have failed.
        */
        requireOk : function () {
            var me                  = this
            var global              = this.global
            var Ext                 = this.getExt()
            var args                = Array.prototype.concat.apply([], arguments)
            
            var callback
            
            if (this.typeOf(args[ args.length - 1 ]) == 'Function') callback = args.pop()
            
            
            // what to do when loading completed or timed-out
            var continuation    = function () {
                me.endAsync(async)
                
                Joose.A.each(args, function (className) {
                    var cls     = Ext.ClassManager.get(className)
                    
                    //                       normal class                         singleton
                    if (cls && (me.typeOf(cls) == 'Function' || me.typeOf(cls.self) == 'Function'))
                        me.pass("Class: " + className + " was loaded")
                    else
                        me.fail("Class: " + className + " was loaded")
                })
                
                callback && me.processCallbackFromTest(callback)
            }
            
            var timeout         = Ext.isIE ? 120000 : 30000,
                async           = this.beginAsync(timeout + 100)
            
            var hasTimedOut     = false
            
            var timeoutId       = global.setTimeout(function () {
                hasTimedOut     = true
                continuation()
            }, timeout)
            
            Ext.Loader.setConfig({ enabled : true });

            Ext.require(args, function () {
                global.clearTimeout(timeoutId)
                
                if (!hasTimedOut) continuation() 
            })
        },
        
        /**
         * This method is a simple wrapper around the {@link #chainClick} - it performs a component query for provided `selector` starting from the `root` container
         * and then clicks on all found components, in order:
         * 

    // click all buttons in the `panel`
    t.clickComponentQuery('button', panel, function () {})
    
         * 
         * The 2nd argument for this method can be omitted and method can be called with 2 arguments only. In this case a global component query will be performed:
         *

    // click all buttons in the application
    t.clickComponentQuery('button', function () {})
    
         * 
         * @param {String} selector The selector to perform a component query with
         * @param {Ext.Container} root The optional root container to start a query from.
         * @param {Function} callback The callback to call, after clicking all the found components
         */
        clickComponentQuery : function (selector, root, callback) {
            
            if (arguments.length == 2 && this.typeOf(arguments[ 1 ]) == 'Function') {
                callback    = root
                root        = this.Ext().ComponentQuery
            }
            
            if (arguments.length == 1) {
                root        = this.Ext().ComponentQuery
            }
            
            var result      = root.query(selector)
            
            this.chainClick(result, function () { callback && callback.call(this, result) })
        },
        
        
        /**
         * An alias for {@link #clickComponentQuery}.
         * 
         * @param {String} selector The selector to perform a component query with
         * @param {Ext.Container} root The optional root container to start a query from.
         * @param {Function} callback The callback to call, after clicking all the found components
         */
        clickCQ : function () {
            this.clickComponentQuery.apply(this, arguments)
        },

        /**
         * This method performs a combination of `Ext.ComponentQuery` and DOM query, allowing to easily find the DOM elements, 
         * matching a css selector, inside of some Ext.Component.
         * 
         * Both queries should be combined with the `=>` separator: 
         *      
         *      gridpanel[title=Accounts] => .x-grid-row
         *       
         * On the left side of such "composite" query should be a component query, on the right - DOM query (CSS selector)
         * 
         * In case when component query returns more than one component, this method iterate through all of them and will try to
         * resolve the 2nd part of the query. The results from the 1st component with matching DOM nodes is returned. 
         * 
         * E.g. the composite query `gridpanel[title=Accounts] => .x-grid-row` will give you the grid row elements inside a grid panel
         * with `title` config matching "Accounts". 
         * 
         * @param {String} selector The CompositeQuery selector
         * @param {Ext.Component} root The optional root component to start the component query from. If omitted, a global component query will be performed.
         * @param {Boolean} allowEmpty False to throw the exception from this method if no matching DOM element is found. Default is `true`.
         * 
         * @return {HTMLElement[]} The array of DOM elements 
         */
        compositeQuery : function (selector, root, allowEmpty) {
            allowEmpty  = allowEmpty !== false
            
            var Ext     = this.Ext();
            // Try to find magic => selector for nested ComponentQuery and CSS selector
            var mainParts  = selector.split('=>');
            var result, i, cmp;

            root        = root || Ext.ComponentQuery;

            if (mainParts.length < 2) throw "Invalid composite query selector: " + selector

            // TODO NICK, AMEND
            var components;

            if (mainParts[0].match(/\./)) {
                // complex case
                var cqParts = mainParts[0].trim().split(' ');

                for (i = 0; i < cqParts.length; i++) {
                    var query = cqParts[i].trim().split('.');

                    // TODO assuming query is specific, targeting just one target
                    root = root.query(query[0])[0];

                    if (query.length > 1) {
                        var fn = query[1].substr(0, query[1].length-2);
                        root = root[fn]();
                    }
                }

                components     = [root];
            } else {
                components     = root.query(mainParts[0]);
            }


            if (!components.length)
                if (allowEmpty) 
                    return []
                else
                    throw 'ComponentQuery ' + mainParts[0] + ' matched no Ext.Component';
            
            for (i = 0; i < components.length; i++) {
                cmp         = components[i];

                if (cmp.rendered) {
                    result = this.compToEl(cmp, false).query(mainParts[1]);

                    if (result.length > 0) {
                        return result;
                    }
                }
            }

            if (allowEmpty) {
                return [];
            }
            throw 'Composite query ' + selector + ' matched no Ext.Component';
        },
        
        /**
         * An alias for Ext.ComponentQuery.query
         * 
         * @param {String} selector The selector to perform a component query with
         */
        cq : function (selector) {
            return this.Ext().ComponentQuery.query(selector);
        },

        /**
         * An shorthand method to get the first result of any Ext.ComponentQuery.query
         * 
         * @param {String} selector The selector to perform a component query with
         */
        cq1 : function (selector) {
            return this.Ext().ComponentQuery.query(selector)[0];
        },

        /**
         * Waits until the passed action target is detected and no ongoing animations are found. This can be a string such as a component query, CSS query or a composite query.
         *
         * @param {String/Siesta.Test.ActionTarget} target The target presence to wait for
         * @param {Function} callback The callback to call after the target has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForTarget : function(target, callback, scope, timeout) {
            this.SUPER(target, function() {
                this.waitForAnimations(callback, scope, timeout);
            }, this, timeout);
        },

        /**
         * This assertion passes if the singleton MessageBox instance is currently visible.
         * The assertion is relevant if you use one of the following methods Ext.Msg.alert, Ext.Msg.confirm, Ext.Msg.prompt.
         *
         * @param {String} [description] The description for the assertion
         */
        messageBoxIsVisible : function(desc) {
            return this.notOk(this.Ext().Msg.isHidden(), desc || 'Message box is visible');
        },

        /**
         * This assertion passes if the singleton MessageBox instance is currently hidden.
         * The assertion is relevant if you use one of the following methods Ext.Msg.alert, Ext.Msg.confirm, Ext.Msg.prompt.
         *
         * @param {String} [description] The description for the assertion
         */
        messageBoxIsHidden : function(desc) {
            return this.ok(this.Ext().Msg.isHidden(), desc || 'Message box is hidden');
        },

        /**
         * This assertion passes if the passed component query matches at least one component.
         *
         * @param {String} query The component query
         * @param {String} [description] The description for the assertion
         */
        cqExists : function(query, description) {
            this.ok(this.cq1(query), description);
        },

        /**
         * This assertion passes if the passed component query matches no components.
         *
         * @param {String} query The component query
         * @param {String} [description] The description for the assertion
         */
        cqNotExists : function(query, description) {
            this.notOk(this.cq1(query), description);
        },

        /**
         * This assertion passes if the passed component query matches at least one component.
         *
         * @param {String} query The component query
         * @param {String} [description] The description for the assertion
         */
        componentQueryExists : function() {
            this.cqExists.apply(this, arguments);
        }
    }
})
