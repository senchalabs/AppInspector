Role('Siesta.Test.AssertionsTranslator', {
    
    has        : {
        translateTo         : { required : true }
    },
    
    
    override : {
        processSubTestConfig : function () {
            var prev            = this.SUPERARG(arguments)
            
            prev.translateTo    = this.translateTo
            
            return prev
        }
    },
    
    
    after : {
        
        addResult : function (result) {
            if (!(result instanceof this.global.Siesta.Result.Summary)) this.translateTo.addTranslatedResult(result)
        },
        
        
        failWithException : function () {
            this.translateTo.failWithException.apply(this.translateTo, arguments)
        }
    }
})

// this call will reset the ids of results in the testing scope, so they will be different from ids of top scope
Siesta.Result.seedID(1000000000)