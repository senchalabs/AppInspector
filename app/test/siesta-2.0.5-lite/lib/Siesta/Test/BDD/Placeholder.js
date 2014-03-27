/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Test.BDD.Placeholder', {
    
    does        : Siesta.Test.Role.Placeholder,
    
    has         : {
        clsConstructor  : { required : true },
        t               : null,
        context         : null,
        
        globals         : {
            init            : [
                'String',
                'Boolean',
                'Number',
                'Date',
                'RegExp',
                'Function',
                'Array',
                'Object'
            ]
        }
    },
    
    
    methods     : {
        
        getClassName : function (onlyGlobals) {
            var clsConstructor      = this.getClassConstructor()
            var context             = this.context

            var clsName
            
            Joose.A.each(this.globals, function (property) {
                if (clsConstructor == context[ property ]) { clsName = property; return false }    
            })
            
            return onlyGlobals ? clsName : clsName || clsConstructor + ''
        },
        
        
        getClassConstructor : function () {
            return this.clsConstructor
        },
        
        
        equalsTo : function (value) {
            var clsConstructor      = this.getClassConstructor()
            
            if (!clsConstructor) return true
            
            if (value instanceof Siesta.Test.BDD.Placeholder) {
                var ownClassName    = this.getClassName(true)
                
                if (
                    value.getClassName(true) == 'Object' && (
                        ownClassName == 'Date' ||
                        ownClassName == 'RegExp' ||
                        ownClassName == 'Function'||
                        ownClassName == 'Array'
                    )
                ) {
                    return true
                }
                
                return clsConstructor == value.getClassConstructor()
            }
            
            var isEqual             = false
            
            var globalCls           = this.getClassName(true)
            
            if (globalCls)
                isEqual             = this.t.typeOf(value) == globalCls || (value instanceof this.context[ globalCls ])
            
            return isEqual || (value instanceof clsConstructor)
        },
        
        
        toString : function () {
            return 'any ' + this.getClassName()
        }
    }
})
