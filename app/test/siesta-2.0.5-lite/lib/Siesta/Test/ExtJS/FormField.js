/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.ExtJS.FormField

This is a mixin, with helper methods for testing functionality relating to Ext.form.Field class. This mixin is being consumed by {@link Siesta.Test.ExtJS}

*/
Role('Siesta.Test.ExtJS.FormField', {
    
    methods : {
        /**
         * Passes if the passed Field has the expected value.
         * 
         * @param {Ext.form.field.Field/String} field A form field or a ComponentQuery
         * @param {Mixed} value The value to compare to.
         * @param {String} [description] The description of the assertion
         */
        fieldHasValue : function(field, value, description) {
            field = this.normalizeComponent(field);
            this.is(field.getValue(), value, description);
        },

        /*
         * @deprecated Use fieldHasValue instead.
         */
        hasValue : function() { this.fieldHasValue.apply(this, arguments); },

        /**
         * Passes if the passed Field has no value ("" or null).
         * 
         * @param {Ext.form.field.Field/String} field A form field or a ComponentQuery
         * @param {String} [description] The description of the assertion
         */
        isFieldEmpty : function(field, description) {
            field = this.normalizeComponent(field);
            var val = field.getValue();
            this.ok(val === null || val === "", description);
        },

        /*
         * @deprecated Use isFieldEmpty instead.
        */
        isEmpty : function() { this.isFieldEmpty.apply(this, arguments); }
    }
});
