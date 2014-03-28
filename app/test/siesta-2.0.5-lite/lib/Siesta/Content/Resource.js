/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Content.Resource', {
    
    has : {
        url             : null,
        
        content         : null
    },
    
    
    methods : {
        
        asHTML : function () {
            throw "Abstract method called"
        },
        
        
        asDescriptor : function () {
            throw "Abstract method called"
        },
        
        
        // todo should check same-origin 
        canCache : function () {
        }
        
    }
        
})
//eof Siesta.Result

