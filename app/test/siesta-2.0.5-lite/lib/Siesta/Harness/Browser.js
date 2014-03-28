/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Harness.Browser
@extends Siesta.Harness 

Class, representing the browser harness. This class provides a web-based UI and defines some additional configuration options.

The default value of the `testClass` configuration option in this class is {@link Siesta.Test.Browser}, which contains
only generic browser-related assertions. So, use this harness class, when testing a generic web page.

This file is for reference only, for a getting start guide and manual, please refer to <a href="#!/guide/siesta_getting_started">Getting Started Guide</a>.


Synopsys
========

    var Harness = Siesta.Harness.Browser;
    
    Harness.configure({
        title     : 'Awesome Test Suite',
        
        transparentEx       : true,
        
        autoCheckGlobals    : true,
        expectedGlobals     : [
            'Ext',
            'Sch'
        ],
        
        preload : [
            "http://cdn.sencha.io/ext-4.0.2a/ext-all-debug.js",
            "../awesome-project-all.js",
            {
                text    : "console.log('preload completed')"
            }
        ]
    })
    
    
    Harness.start(
        // simple string - url relative to harness file
        'sanity.t.js',
        
        // test file descriptor with own configuration options
        {
            url     : 'basic.t.js',
            
            // replace `preload` option of harness
            preload : [
                "http://cdn.sencha.io/ext-4.0.6/ext-all-debug.js",
                "../awesome-project-all.js"
            ]
        },
        
        // groups ("folders") of test files (possibly with own options)
        {
            group       : 'Sanity',
            
            autoCheckGlobals    : false,
            
            items       : [
                'data/crud.t.js',
                ...
            ]
        },
        ...
    )



*/

Class('Siesta.Harness.Browser', {
    
    // static
    my : {
        isa         : Siesta.Harness,
        
        has : {
            id                  : null,
            
            /**
             * @cfg {Class} testClass The test class which will be used for creating test instances, defaults to {@link Siesta.Test.Browser}.
             * You can subclass {@link Siesta.Test.Browser} and provide a new class. 
             * 
             * This option can be also specified in the test file descriptor. 
             */
            testClass           : Siesta.Test.Browser,
            
            viewportClass       : "Siesta.Harness.Browser.UI.Viewport",

            viewport            : null,
            
            /**
             * @cfg {Boolean} autoRun When set to `true`, harness will automatically launch the execution either of the checked test files or the whole suite.
             * Default value is `false`
             */
            autoRun             : false,
            
            /**
             * @cfg {Boolean} viewDOM When set to `true`, harness will expand the panel with the `<iframe>` of the test file, so you can examine the content of DOM.
             * Default value is `false`
             */
            viewDOM             : false,
            
            /**
             * @cfg {Boolean} speedRun When set to `true`, harness will reduce the quality or completely remove the visual effects for events simulation,
             * improving the speed of test. Default value is `true`.
             * 
             * This option can be also specified in the test file descriptor.
             */
            speedRun            : true,

            /**
             * @cfg {Boolean} breakOnFail When set to `true`, harness will not start launching any further tests after detecting a failed assertion.
             * improving the speed of test. Default value is `false`.   
             */
            breakOnFail             : false,
            activateDebuggerOnFail  : false,

            contentManagerClass : Siesta.Content.Manager.Browser,
            scopeProvider       : 'Scope.Provider.IFrame',
            
            /**
             * @cfg {Boolean} disableCaching When set to `true`, harness will prevent the browser caching of files being preloaded and the test files, by appending
             * a query string to it.
             * Note, that in this case, debuggers may not understand that you are actually loading the same file, and breakpoints may not work. Default value is `false`
             */
            disableCaching      : false,
            
            baseUrl             : window.location.href.replace(/\?.*$/,'').replace(/\/[^/]*$/, '/'),
            baseHost            : window.location.host,
            baseProtocol        : window.location.protocol,
            
            /**
             * @cfg {Boolean} forceDOMVisible When set to `true` the tests will be executed in "fullscreen" mode, with their iframes on top of all other elements.
             * This is required in IE if your test includes interaction with the DOM, for example when using the `document.getElementFromPoint()` method (it will not work unless the element
             * is visible).
             *
             * This option is enabled by default in IE and disabled in all other browsers.
             * This option can be also specified in the test file descriptor (usually you will create a group of "rendering" tests). Usually it's only relevant for IE,
             * so using this option should look like:
             *

    Harness.start(
        {
            group       : 'Rendering',
            
            forceDOMVisible    : $.browser.msie,
            
            items       : [
                'rendering/01_grid.t.js',
                ...
            ]
        },
        ...
    )
            
             */
            forceDOMVisible     : $.browser.msie,
            
            
            /**
             * @cfg {String} hostPageUrl The url of the HTML page which will be the target for the test(s). This option is used for application level testing, Siesta will visit this URL and then launch
             * the test. See `/examples/021-extjs-drag-drop/index.js` for an example.
             * 
             * Note that with this option, the test descriptor will stop inheriting the {@link #preload} option from parent descriptors/harness
             * (to make sure you don't preload your dependencies twice). This is usually an expected behavior, and you still can specify the `preload` option
             * directly on such descriptor if needed.
             * 
             * This option can be also specified in the test file descriptor.
             * 
             * For example, to define that a test should be executed on a page generated by some php script:

    Harness.start(
        {
            hostPageUrl     : '../my_php_script?page=home',     // url of the html page for test
            url             : '020_home_page_drag_n_drop.t.js'  // url of the js file, containing actual test code
        },
        ...
    )
             *  
             * 
             */
            hostPageUrl         : null,
            
            
            /**
             * @cfg {Boolean} useStrictMode When set to `false` the test scopes will be created w/o strict mode `DOCTYPE`. Default value is `true`.
             * This option is not applicable for tests with `hostPageUrl` option. 
             * 
             * This option can be also specified in the test file descriptor.
             */
            useStrictMode       : true,
            
            
            /**
             * @cfg {String} runCore Either `parallel` or `sequential`. Indicates how the individual tests should be run - several at once or one-by-one.
             * 
             * Default value is "parallel", except for IE 6, 7, 8 where it's set to `sequential`. You should not need to change this option.
             */
            runCore                 : 'parallel',
            
            /**
             * @cfg {String} simulateEventsWith
             * 
             * This option is IE9-strict mode (and probably above) specific. It specifies how Siesta should simulate events.
             * The options are 'dispatchEvent' (W3C standard) or 'fireEvent' (MS interface) - both are available in IE9 strict mode
             * and each activates different set of event listeners. See this blog post for detailed explanations: 
             * <http://www.digitalenginesoftware.com/blog/archives/76-DOM-Event-Model-Compatibility-or-Why-fireEvent-Doesnt-Trigger-addEventListener.html>
             * 
             * Valid values are "dispatchEvent" and "fireEvent".
             * 
             * The framework specific adapters (like {@link Siesta.Test.ExtJS} and like {@link Siesta.Test.jQuery}) chooses the most appropriate value 
             * automatically (unless explicitly configured). 
             */
            simulateEventsWith  : {
                is      : 'rw',
                init    : 'dispatchEvent'
            },
            
            // the test with currently "forced" (by the "forceDOMVisible" option) iframe 
            testOfForcedIFrame          : null,
            
            /**
             * @cfg {Boolean} autoScrollElementsIntoView
             * 
             * With this option enabled Siesta will try to scroll the invisible action targets into the view automatically, before performing the
             * action. 
             * 
             * This option can also be specified in the test file descriptor.
             */
            autoScrollElementsIntoView  : true,
            
            /**
             * @cfg {Boolean} maintainViewportSize
             * 
             * Enabling this option will cause Siesta to honor the {@link #viewportWidth} and {@link #viewportHeight} configuration options.
             * 
             * This option can also be specified in the test file descriptor.
             */
            maintainViewportSize        : true,
            
            /**
             * @cfg {Number} viewportWidth 
             * 
             * The width of the test iframe, default value is 1024
             */
            viewportWidth               : 1024,
            
            /**
             * @cfg {Number} viewportHeight
             * 
             * The height of the test iframe, default value is 768
             */
            viewportHeight              : 768,
            
            needUI                      : true,
            
            isAutomated                 : false,
            
            // will read the settings from cookies when started
            stateful                    : true
        },
        
        
        after : {
            
            onBeforeScopePreload : function (scopeProvider, url) {
                if (this.viewport) this.viewport.onBeforeScopePreload(scopeProvider, url)
            },
            
            
            onTestSuiteStart : function (descriptors, contentManager) {
                if (this.viewport) this.viewport.onTestSuiteStart(descriptors, contentManager)
            },
            
            
            onTestSuiteEnd : function (descriptors, contentManager) {
                if (this.viewport) this.viewport.onTestSuiteEnd(descriptors, contentManager)
                
                // remove the links to forced iframe / test in hope to ease the memory pressure
                delete this.testOfForcedIFrame
            },
            
            
            onTestStart : function (test) {
                if (this.viewport) this.viewport.onTestStart(test)
                
                if (test.hasForcedIframe()) {
                    if (this.testOfForcedIFrame) this.hideForcedIFrame(this.testOfForcedIFrame)
                
                    this.showForcedIFrame(test)
                
                    this.testOfForcedIFrame     = test
                }        
            },
            
            
            onTestUpdate : function (test, result, parentResult) {
                if (this.viewport) this.viewport.onTestUpdate(test, result, parentResult)
                
                if ((result instanceof Siesta.Result.Diagnostic) && result.isWarning && this.needUI) { 
                    if (typeof console != 'undefined' && console.warn) console.warn(result + '')
                }
            },
            
            
            onTestEnd : function (test) {
                if (test.hasForcedIframe())             this.hideForcedIFrame(test)
                
                if (test == this.testOfForcedIFrame)    this.testOfForcedIFrame = null
                
                if (this.viewport) this.viewport.onTestEnd(test)
                
                // when browser is simulating the event on the element that is not visible in the iframe
                // it will scroll that point into view, using the `scrollLeft` property of the parent element
                // this line fixes that displacement
                var wrapper     = test.scopeProvider.wrapper
                
                if (wrapper) {
                    wrapper.scrollLeft      = wrapper.scrollTop = 0
                }
            },
            
            
            onTestFail : function (test, exception, stack) {
                if (this.viewport) this.viewport.onTestFail(test, exception, stack)
            }
        },
        
        
        methods : {
            createViewport       : function(config) {
                return Ext.create("Siesta.Harness.Browser.UI.Viewport", config);
            },
            
            
            canShowCursorForTest : function (test) {
                // return false for test's running in popups (not iframes), since we can't show any visual accompaniment for them
                if (!(test.scopeProvider instanceof Scope.Provider.IFrame)) return false;
            
                // if there is a "forced to be on top" test then we only need to compare the tests instances
                if (this.testOfForcedIFrame) {
                    return this.testOfForcedIFrame.isFromTheSameGeneration(test)
                }
                
                // finally we can only show cursor for tests with iframe wrapper
                // (since mouse visualizer puts the cursor in it)
                return Boolean(test.scopeProvider.wrapper)
            },
            
            
            configure : function() {
                this.SUPERARG(arguments);

                this.id = this.title || window.location.href;
            },

            
            start : function () {
                // Opera's global variables handling is weird
                if ($.browser.opera) {
                    this.autoCheckGlobals = false;
                }
                
                if ($.browser.msie && $.browser.version !== "9.0") {
                    if (!this.hasOwnProperty('runCore'))            this.runCore            = 'sequential'
                }
                
                this.SUPERARG(arguments)
            },
            
            
            launch : function () {
                var me = this
                
                var args        = arguments
                var SUPER       = this.SUPER
                
                if (this.needUI && !this.viewport) {
                    var cb = function () {
//                        if (Ext.QuickTips) {
//                            Ext.QuickTips.init();
//                        }
//
                        me.viewport = me.createViewport({
                            title           : me.title,
                            harness         : me
                        });
                        
                        // if we are here, then we were requested to show the UI for automated launch
                        // auto-launch the test suite in this case
                        if (me.isAutomated) SUPER.apply(me, args) 
                    };

                    if (Ext.setup) {
                        Ext.setup({ onReady : cb });
                    } else {
                        Ext.onReady(cb) 
                    }
                } else {
                    this.SUPERARG(arguments)
                }
            },
            
            
            populateCleanScopeGlobals : function (scopeProvider, callback) {
                if ($.browser.msie && Number(/^(\d+)/.exec($.browser.version)[ 1 ]) < 9) {
                    // do nothing for IE < 9 - testing leakage of globals is not supported
                    // also IE8 often crashes on this stage
                    this.disableGlobalsCheck = true
                    
                    callback()
                    
                    return
                }
                
                // always populate the globals from IFrame (even if user specified the Window provider)
                this.SUPER('Scope.Provider.IFrame', callback)
            },
            
            
            setup : function (callback) {
                var me      = this
                var sup     = this.SUPER

                // delay the super setup until dom ready
                if (!this.isAutomated) {
                    Ext.onReady(function () {
                        // init the singletone
                        Siesta.Harness.Browser.FeatureSupport();
                    
                        sup.call(me, callback);
                    });
                } else {
                    $(function () {
                        // init the singletone
                        Siesta.Harness.Browser.FeatureSupport();
                    
                        sup.call(me, callback);
                    });
                }
            },
            
            
            getDescriptorConfig : function (descriptor, configName, doNotLookAtRoot) {
                // if its any other config use regular parent implementation
                if (configName != 'preload') return this.SUPERARG(arguments)
                
                var testConfig          = descriptor.testConfig
                
                var hasOwnPreload       = testConfig && testConfig.hasOwnProperty('preload') || descriptor.hasOwnProperty('preload')
                // this will include lookup in the "testConfig"
                var preloadValue        = this.lookUpValueInDescriptorTree(descriptor, 'preload')
                
                var hasHostPageUrl      = Boolean(this.getDescriptorConfig(descriptor, 'hostPageUrl', true))
                
                // for host page url, if we found preload value which is not inherit, then return it if its own (defined on the descriptor)
                // otherwise return empty array
                if (hasHostPageUrl && preloadValue != 'inherit') return hasOwnPreload ? preloadValue : []
                        
                do {
                    var testConfig      = descriptor.testConfig
                    var testHasPreload  = testConfig && testConfig.hasOwnProperty('preload')
                    
                    if (testHasPreload || descriptor.hasOwnProperty('preload')) {
                        var preload     = testHasPreload ? testConfig.preload : descriptor.preload
                        
                        if (preload != 'inherit') return preload
                    }
                    
                    descriptor          = descriptor.parent
                    
                } while (descriptor && descriptor != this)
                    
                if (doNotLookAtRoot) 
                    return undefined
                else
                    return this.preload
            },
            
            
            getScopeProviderConfigFor : function (desc, launchId) {
                var config                      = this.SUPERARG(arguments)
                
                config.cls                      = 'tr-iframe'
                config.performWrap              = true
                config.wrapCls                  = 'tr-iframe-wrapper'
                config.sourceURL                = config.sourceURL || this.getDescriptorConfig(desc, 'hostPageUrl')
                config.minViewportSize          = config.minViewportSize || {
                    width   : this.getDescriptorConfig(desc, 'viewportWidth'),
                    height  : this.getDescriptorConfig(desc, 'viewportHeight')
                }
                
                if (!config.hasOwnProperty('useStrictMode')) config.useStrictMode = this.getDescriptorConfig(desc, 'useStrictMode')
                
                return config
            },
            
            
            getNewTestConfiguration : function (desc, scopeProvider, contentManager, options, runFunc) {
                var config          = this.SUPERARG(arguments)
                
                if (this.getDescriptorConfig(desc, 'speedRun')) {
                    Joose.O.extend(config, {
                        actionDelay         : 1,
                        dragPrecision       : 20,
                        dragDelay           : 10
                    })
                }
                
                if (this.hasOwnProperty('simulateEventsWith')) config.simulateEventsWith = this.simulateEventsWith
                
                config.forceDOMVisible              = this.getDescriptorConfig(desc, 'forceDOMVisible')
                config.autoScrollElementsIntoView   = this.getDescriptorConfig(desc, 'autoScrollElementsIntoView')
                
                return config
            },
            
            
            runCoreGeneral : function (descriptors, contentManager, options, callback) {
                
                if (this.runCore == 'parallel') {
                    
                    var me                  = this
                    var canRunParallel      = []
                    var mustRunSequential   = []
                    
                    Joose.A.each(descriptors, function (desc) {
                        
                        if (me.getDescriptorConfig(desc, 'forceDOMVisible'))
                            mustRunSequential.push(desc)
                        else
                            canRunParallel.push(desc)
                    })
                    
                    this.runCoreParallel(canRunParallel, contentManager, options, function () {
                        
                        setTimeout(function () {
                            
                            me.runCoreSequential(mustRunSequential, contentManager, options, callback)
                            
                        }, 100)
                    })
                
                } else
                    this.SUPERARG(arguments)
            },
            
            
            normalizeURL : function (url) {
                // ref to JSAN module - DEPRECATED
                if (/^jsan:/.test(url)) url = '/jsan/' + url.replace(/^jsan:/, '').replace(/\./g, '/') + '.js'
                
                // ref to lib in current dist (no `/` and trailing `.js`) - DEPRECATED 
                if (!/\.js$/.test(url) && !/\//.test(url) && !/\.css(\?.*)?$/i.test(url)) url = '../lib/' + url.replace(/\./g, '/') + '.js'
                
                return url
            },
            
            
            resolveURL : function (url, scopeProvider, desc) {
                // if the `scopeProvider` is provided and it has a sourceURL - then absolutize the preloads relative to that url
                if (scopeProvider && scopeProvider.sourceURL) url = this.absolutizeURL(url)
                
                if (this.disableCaching)
                    // if there's a ?param string in url - append new param
                    if (/\?./.test(url))
                        url += '&disableCaching=' + new Date().getTime()
                    else
                        if (!/\?$/.test(url)) 
                            url += '?disableCaching=' + new Date().getTime()
                
                // otherwise assumed to be a raw filename, relative or absolute
                return url
            },
            
            
            absolutizeURL : function (url, baseUrl) {
                // if the url is already absolute - just return it (perhaps with some normalization - 2nd case)
                if (/^(https?|file):\/\//.test(url))  return url
                if (/^\//.test(url))    return this.baseProtocol + '//' + this.baseHost + url
                
                baseUrl             = baseUrl || this.baseUrl
                
                // strip the potential query and filename from baseURL, leaving only the "directory" part
                baseUrl             = baseUrl.replace(/\?.*$/,'').replace(/\/[^/]*$/, '/')
                
                // first absolutize the base url relative the harness page (which will be always global, so it won't recurse)
                var absBaseUrl      = this.absolutizeURL(baseUrl, this.baseUrl)
                
                // add a trailing "/" if missing
                absBaseUrl          = absBaseUrl.replace(/\/?$/, '/')
                
                return absBaseUrl + url
            },
            
            
            showForcedIFrame : function (test) {
                $.rebindWindowContext(window);
                
                var wrapper     = test.scopeProvider.wrapper
                
                $(wrapper).addClass('tr-iframe-forced')
                $(wrapper).removeClass('tr-iframe-hidden')
            
                $(wrapper).center()
                
                test.fireEvent('testframeshow')
            },
        
        
            hideForcedIFrame : function (test) {
                $.rebindWindowContext(window);
                
                var wrapper     = test.scopeProvider.wrapper
                
                $(wrapper).removeClass('tr-iframe-forced')
                $(wrapper).addClass('tr-iframe-hidden')
                
                test.fireEvent('testframehide')
            },
            
            getQueryParam : function (paramName) {
                var regex       = new RegExp('(?:\\?|&)' + paramName + '=(.*?)(?:\\?|&|$)', 'i')
            
                var match       = regex.exec(window.location.search)
            
                if (!match) return null
            
                return match[ 1 ]
            }
        }
        
    }
    //eof my
})
//eof Siesta.Harness.Browser