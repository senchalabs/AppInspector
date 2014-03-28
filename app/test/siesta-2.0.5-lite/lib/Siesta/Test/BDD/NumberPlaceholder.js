/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Test.BDD.NumberPlaceholder', {
    
    does        : Siesta.Test.Role.Placeholder,
    
    has         : {
        value           : { required : true },
        threshold       : null
    },
    
    
    methods     : {
        
        initialize : function () {
            if (this.threshold == null) this.threshold = this.value * 0.05
        },
        
        
        equalsTo : function (value) {
            return Math.abs(value - this.value) <= this.threshold
        },
        
        
        toString : function () {
            return 'any number approximately equal to ' + this.value
        }
    }
})
