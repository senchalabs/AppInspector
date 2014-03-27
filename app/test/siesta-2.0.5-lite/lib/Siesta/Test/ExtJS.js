/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 *
@class Siesta.Test.ExtJS
@extends Siesta.Test.Browser
@mixin Siesta.Test.ExtJSCore
@mixin Siesta.Test.ExtJS.Ajax
@mixin Siesta.Test.ExtJS.Observable
@mixin Siesta.Test.ExtJS.FormField
@mixin Siesta.Test.ExtJS.Component
@mixin Siesta.Test.ExtJS.Element
@mixin Siesta.Test.ExtJS.Store
@mixin Siesta.Test.ExtJS.DataView
@mixin Siesta.Test.ExtJS.Grid

A base class for testing browser and ExtJS applications. It inherit from {@link Siesta.Test.Browser}
and adds various ExtJS specific assertions.

This file is a reference only, for a getting start guide and manual, please refer to <a href="#!/guide/siesta_getting_started">Getting Started Guide</a>.

*/
Class('Siesta.Test.ExtJS', {

    isa         : Siesta.Test.Browser,

    does        :  [
        Siesta.Test.ExtJSCore,
        Siesta.Test.ExtJS.Component,
        Siesta.Test.ExtJS.Element,
        Siesta.Test.ExtJS.FormField,
        Siesta.Test.ExtJS.Observable,
        Siesta.Test.ExtJS.Store,
        Siesta.Test.ExtJS.Grid,
        Siesta.Test.ExtJS.DataView,
		Siesta.Test.ExtJS.Ajax
    ],

    
    has : {
        globalExtOverrides      : null,
        
        extPathRegex1           : /(.*ext(?:js)?-\d\.\d+(?:\.\d+)?.*?)\/ext-all(?:-debug|-dev)?\.js/,
        extPathRegex2           : /(.*ext(?:js)?\/gpl\/\d\.\d+(?:\.\d+)?.*?)\/ext-all(?:-debug|-dev)?\.js/
    },
    
    methods : {

        getExtBundlePath : function() {
            var path
            var testDescriptor      = this.harness.getScriptDescriptor(this.url)
            var me                  = this

            while (testDescriptor && !path) {
                if (testDescriptor.preload) {
                    Joose.A.each(testDescriptor.preload, function (url) {
                        if (url.match && (url.match(me.extPathRegex1) || url.match(me.extPathRegex2))) {
                            path    = url;
                            return false;
                        }
                    });
                }
                testDescriptor = testDescriptor.parent;
            }

            return path;
        },


        getExtBundleFolder : function() {
            var folder;
            var testDescriptor      = this.harness.getScriptDescriptor(this.url)
            var me                  = this

            while (testDescriptor && !folder) {
                if (testDescriptor.preload) {
                    Joose.A.each(testDescriptor.preload, function (url) {
                        var match = me.extPathRegex1.exec(url) || me.extPathRegex2.exec(url);

                        if (match) folder = match[1];
                        
                        return false
                    });
                }
                testDescriptor = testDescriptor.parent;
            }

            return folder;
        },
        
        
        getNumberOfGlobalExtOverrides : function (callback) {
            var globalExtOverrides  = this.globalExtOverrides;
            
            if (globalExtOverrides != null) 
                callback && callback.call(this, globalExtOverrides.length, globalExtOverrides)
            else {
                var me              = this;
                var Ext             = this.getExt();
                var extjsBundleURL  = me.getExtBundlePath()
    
                if (!extjsBundleURL) {
                    me.fail("Can'me find ExtJS bundle url");
                    callback && callback.call(me, null, null)
                    return;
                }

                // For IE
                this.expectGlobal('0');

                var frame           = Ext.core.DomHelper.append(Ext.getBody(), { 
                    tag     : "iframe",
                    style   : 'display:none'
                }, false);
                
                var freshWin        = frame.contentWindow;
    
                freshWin.document.open();
    
                freshWin.document.write(
                    '<html><head><script type="text/javascript" src="' + extjsBundleURL + '"></script></head><body></body></html>'
                );
    
                freshWin.document.close();
                
                var resolveObject   = function (hostObj, nameSpace) {
                    var parts   = nameSpace.split('.');
                    var p       = hostObj
    
                    for (var i = 0; i < parts.length; i++) {
                        p       = p[ parts[ i ] ];
                    };
    
                    return p;
                }
    
                var ignore          = function (name) {
                    return name.match(/Ext\.data\.Store\.ImplicitModel|collectorThreadId/);
                }
                
                var getObjectDifferences    = function (cleanObj, dirtyObj, ns) {
                    var diff    = []

                    for (var p in dirtyObj) {
                        try {
                            if (dirtyObj.hasOwnProperty(p)) {
                                // Check if the object exists on the clean window and also do a string comparison
                                // in case a builtin method has been overridden
                                if (
                                    (!cleanObj.hasOwnProperty(p) && typeof cleanObj[p] == 'undefined' ) ||
                                        (typeof dirtyObj[p] == 'function' && cleanObj[p].toString() !== dirtyObj[p].toString()) ||
                                        (Ext.isPrimitive(dirtyObj[p]) && dirtyObj[p].toString() !== cleanObj[p].toString())
                                ) {
                                    if (!ignore(ns + '.' + p)) diff.push(ns + '.' + p);
                                }
                            }
                        } catch (e) {
                            // Just continue
                        }
                    }
                    return diff;
                }
                
                me.waitFor(
                    function () { return freshWin.Ext && freshWin.Ext.isReady; }, 
                    function () {
                        var dirtyWin    = me.global,
                            overrides   = [];
        
                        // Check for native class augmentations
                        Ext.iterate(Ext.ClassManager.classes, function (item) {
                            if (!item.match(/^Ext\./)) return;
        
                            var freshItem   = resolveObject(freshWin, item);
                            var dirtyItem   = resolveObject(dirtyWin, item);
        
                            if (freshItem && typeof dirtyItem !== 'undefined') {
                                var staticDiff = getObjectDifferences(freshItem,  dirtyItem, item);
                                    
                                overrides.push.apply(overrides, staticDiff);
        
                                // Prototype properties
                                if (dirtyItem.prototype) {
                                    var prototypeDiff = getObjectDifferences(freshItem.prototype, dirtyItem.prototype, item + '.prototype');
                                    
                                    overrides.push.apply(overrides, prototypeDiff);
                                }
                            }
                        });
                        
                        me.globalExtOverrides   = overrides
                        
                        callback && callback.call(me, overrides.length, overrides)
                    }
                )
                // eof waitFor
            }
        },
        

        /**
         * This assertion passes if no global Ext JS overrides exist. It creates a fresh iframe window where a new, fresh copy
         * of Ext JS w/o any overrides is loaded and then a comparison is made against the copy of Ext JS loaded in the test.
         * 
         * A global ExtJS override is some change, made in the core class, for example like this:
         * 

    Ext.data.Store.override({
        removeAll       : function () {
            // my fix
            ...
        }
    })

         * While such overrides are often seems as the only possible solution (usually for some bug in Ext) they should be 
         * avoided as much as possible, because it a very bad practice. For example, in the previous case, a better approach
         * would be to create a new subclass of the Ext.data.Store with the desired changed.
         * 
         * See also {@link #assertMaxNumberOfGlobalExtOverrides} assertion. 
         *
         * @param {String} [description] The description for the assertion
         */
        assertNoGlobalExtOverrides : function (description) {
            this.getNumberOfGlobalExtOverrides(function (length, overrides) {
                if (length == null) {
                    this.fail("Was not able to find the ExtJS bundle URL in the `assertNoGlobalExtOverrides` assertion")
                    return
                }
                
                if (length) {
                    this.fail(description, {
                        assertionName   : 'assertNoGlobalExtOverrides',
                        descTpl         : 'No global Ext overrides found',
                        
                        got             : length,
                        gotDesc         : "Number of overrides found",
                        
                        annotation      : "Found overrides for: `" + overrides.join('`, `') + '`'
                    })
                } else
                    this.pass(description, {
                        descTpl             : 'No global Ext overrides found'
                    })
            })
        },

        
        /**
         * This assertion passes if the number of global overrides does not exceed the given number.
         * 
         * For example, you can add this assertion in your existing codebase (assuming you have 3 overrides your application
         * cannot function without):
         * 
         *      t.assertMaxNumberOfGlobalExtOverrides(3, "Ideally should be none of these")
         *      
         * and catch all the cases when someone adds a new global override.
         * 
         * @param {Number} maxNumber The maximum number of Ext JS overrides allowed
         * @param {String} [description] The description for the assertion
         */
        assertMaxNumberOfGlobalExtOverrides : function (maxNumber, description) {
            this.getNumberOfGlobalExtOverrides(function (length, overrides) {
                if (length == null) {
                    this.fail("Was not able to find the ExtJS bundle URL in the `assertMaxNumberOfGlobalExtOverrides` assertion")
                    return
                }
                
                if (length > maxNumber) {
                    this.fail(description, {
                        assertionName   : 'assertNoGlobalExtOverrides',
                        descTpl         : 'Found less or equal than ' + maxNumber + ' ext global overrides',
                        
                        got             : length,
                        gotDesc         : "Number of overrides found",
                        
                        annotation      : "Found overrides for: `" + overrides.join('`, `') + '`'
                    })
                } else
                    this.pass(description, {
                        descTpl             : 'Found less or equal than ' + maxNumber + ' ext global overrides',
                        annotation          : "Number of overrides found: " + length
                    })
            })
        },

        /**
         * A helper method returning the total number of Ext JS container layouts that have been performed since the beginning of the page lifecycle.
         * @return {Int} The number of layouts
         */
        getTotalLayoutCounter : function () {
            var count       = 0

            this.Ext().each(this.cq('container'), function(c) { count += c.layoutCounter });

            return count;
        },

        /**
         * This assertion passes if no Ext JS layout cycles are performed as a result of running the passed function. This
         * function will query all containers on the page and measure the number of layouts performed before and after the function call.
         *
         * @param {Function} fn The function to call
         * @param {Object} scope The 'thisObject' to use for the function call
         * @param {String} [description] The description for the assertion
         */
        assertNoLayoutTriggered : function(fn, scope, description) {
            var countBefore = this.getTotalLayoutCounter();

            fn.call(scope || this);

            this.is(this.getTotalLayoutCounter(), countBefore, description);
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
                method          : function () { return !Ext.fx.Manager.items || Ext.fx.Manager.items.getCount() === 0; },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForAnimations',
                description     : ' animations to finalize'
            });
        }
    }
})
