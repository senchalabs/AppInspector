/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Result.Assertion', {
    
    isa : Siesta.Result,
    

    has : {
        name        : null,
        
        passed      : null,
        
        annotation  : null,
        
        index       : null,
        // stored as string
        sourceLine  : null,
        
        isSkipped   : false,
        isTodo      : false,
        
        isException     : false,
        exceptionType   : null,
        
        isWaitFor   : false,
        completed   : false     // for waitFor assertions
    },
    
    
    methods : {
        
        isPassed : function (raw) {
            if (raw) return this.passed
            
            if (this.isTodo) return true
            
            if (this.isWaitFor && !this.completed) return true
            
            return this.passed
        },
        
        
        toString : function () {
            var text = (this.isTodo ? 'TODO: ' : '') + (this.passed ? 'ok ' : 'fail ') + this.index + ' - ' + this.description
            
            if (this.annotation) text += '\n' + this.annotation
            
            return text
        },
        
        
        toJSON : function () {
            var me      = this
            
            var info    = {
                type            : this.meta.name,
                passed          : this.passed,
                description     : this.description || 'No description'
            }
            
            // copy if true
            Joose.A.each([ 'isTodo', 'annotation', 'isWaitFor', 'isException', 'sourceLine', 'name' ], function (name) {
                if (me[ name ]) info[ name ] = me[ name ]
            })
            
            if (this.isException)   {
                info.exceptionType  = this.exceptionType
            }
            
            return info
        }
    }
})

