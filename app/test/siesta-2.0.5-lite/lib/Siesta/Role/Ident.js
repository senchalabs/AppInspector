/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Role('Siesta.Role.Ident', {
    
    has         : {
        id                  : null,
        title               : null,
        description         : null
    },
    
    
    before : {
        
        initialize : function () {
            if (!this.title && !this.id) throw "Either `id` or `title` must be provided for " + this 
            
            this.title      = this.title    || this.id
            this.id         = this.id       || this.title
        }
    },
    
    
    methods : {
        
        toString : function() {
            return this.title || this.id
        }
    }
})
