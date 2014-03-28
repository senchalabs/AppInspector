/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Role('Siesta.Util.Role.CanFormatStrings', {
    
    methods : {
        
        formatString: function (string, data) {
            var match
            var variables           = []
            var isRaw               = []
            var regexp              = /\{(\!)?((?:\w|-|_)+?)\}/g
            
            while (match = regexp.exec(string)) {
                isRaw.push(match[ 1 ])
                variables.push(match[ 2 ])
            }
            
            var result              = string
            
            Joose.A.each(variables, function (variable, index) {
                var varIsRaw        = isRaw[ index ]
                
                result              = result.replace(
                    new RegExp('\\{' + (varIsRaw ? '!' : '') + variable + '\\}', 'g'), 
                    data.hasOwnProperty(variable) ? 
                        varIsRaw ? data[ variable ] + '' : Siesta.Util.Serializer.stringify(data[ variable ]) 
                    : 
                        ''
                )
            })
            
            return result
        }
    }
})
