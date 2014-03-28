/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.ExtJS.Element

This is a mixin, with helper methods for testing functionality relating to DOM elements. This mixin is consumed by {@link Siesta.Test.ExtJS}

*/
Role('Siesta.Test.ExtJS.Element', {
    
    methods : {
        /**
         * Passes if the passed element has the expected region.
         * 
         * @param {Ext.Element} el The element
         * @param {Ext.util.Region} region The region to compare to.
         * @param {String} [description] The description of the assertion
         */
        hasRegion : function(el, region, description) {
            var elRegion = el.getRegion();

            this.is(elRegion["top"], region["top"], description + ' (top)');
            this.is(elRegion["right"], region["right"], description + ' (right)');
            this.is(elRegion["bottom"], region["bottom"], description + ' (bottom)');
            this.is(elRegion["left"], region["left"], description + ' (left)');
        }
    }
});
