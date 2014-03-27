/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 * 
@class Siesta.Test.jQuery
@extends Siesta.Test.Browser

A base class for testing jQuery applications. It inherit from {@link Siesta.Test.Browser} and adds various jQuery specific assertions.

This file is a reference only, for a getting start guide and manual, please refer to <a href="#!/guide/siesta_getting_started">Getting Started Guide</a>.

*/
Class('Siesta.Test.jQuery', {
    
    isa         : Siesta.Test.Browser,
        
    methods : {
        
        initialize : function() {
            // Since this test is preloading jQuery, we should let Siesta know what to 'expect'
            this.expectGlobals('$', 'jQuery');
            this.SUPER();
        },
     

        /**
         * This method returns the jQuery object from the scope of the test. When creating your own assertions for jQuery code, you need
         * to make sure you are using this method to get the `jQuery` instance. 
         * @return {Object} The `$` object from the scope of test
         */
        get$ : function () {
            return this.global.$;
        },

        normalizeElement : function(el) {
            return el.jquery ? el.get(0) : this.SUPER(el);
        }
    }
})
