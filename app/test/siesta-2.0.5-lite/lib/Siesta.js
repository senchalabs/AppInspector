/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta', {
    /*PKGVERSION*/VERSION : '2.0.5',

    // "my" should been named "static"
    my : {
        
        has : {
            config          : null,
            activeHarness   : null
        },
        
        methods : {
        
            getConfigForTestScript : function (text) {
                try {
                    eval(text)
                    
                    return this.config
                } catch (e) {
                    return null
                }
            },
            
            
            StartTest : function (arg1, arg2) {
                if (typeof arg1 == 'object') 
                    this.config = arg1
                else if (typeof arg2 == 'object')
                    this.config = arg2
                else
                    this.config = null
            }
        }
    }
})

// fake StartTest function to extract test configs
if (typeof StartTest == 'undefined') StartTest = Siesta.StartTest
if (typeof startTest == 'undefined') startTest = Siesta.StartTest
if (typeof describe == 'undefined') describe = Siesta.StartTest