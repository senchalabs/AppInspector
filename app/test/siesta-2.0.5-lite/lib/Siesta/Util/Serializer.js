/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Util.Serializer', {
    
    isa : Data.Visitor2,
    
    has     : {
        result                  : Joose.I.Array,
        manualEnum              : function () {
            for (var i in { toString : 1 }) return false
            
            return true
        }
    },
    
    
    methods : {
        
        assignRefAdrTo : function (object) {
            try {
                return this.SUPER(object)
            } catch (e) {
                if (!object.__REFADR__) object.__REFADR__ = this.getRefAdr()
            }
            
            return object.__REFADR__
        },
        
        
        write : function (str) {
            this.result.push(str)
        },
        
        
        visitOutOfDepthValue : function (value, depth) {
            this.write('...')
        },
        
        
        visitValue : function (value) {
            if (value == null)
                // `null` and `undefined`
                this.write(value + '')
            else
                this.write(typeof value == 'string' ? '"' + value.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"' : value + '')
        },
        
        
        visitObjectKey : function (key, value, object) {
            this.write('"' + key + '": ')
        },
        
        
        getClassNameFor : function (object) {
            if (object.nodeType != null && object.nodeName != null && object.tagName) return 'DOMElement'
            
            // trying to detect and not dive into global window
            if (object.document != null && object.location != null && object.location.href != null) return 'Window'
            
            return this.SUPER(object)
        },
        
        
        visitSeen : function (value, depth) {
            this.write('[Circular]')
        },
        
        
        visitRegExp : function (value, depth) {
            this.write(value + '')
        },
        
        
        visitFunction : function (value, depth) {
            this.write('function ' + (value.name || '') + '() { ... }')
        },
        
        
        visitDate : function (value, depth) {
            this.write('"' + value + '"')
        },
        

        // safer alternative to parent's implementation of `visitObject` - some host objects has no "hasOwnProperty" method
        visitObject : function (object, depth) {
            for (var key in object) {
                if (key != '__REFADR__' && (!object.hasOwnProperty || object.hasOwnProperty(key))) {
                    var value   = object[ key ]
                    
                    this.visitObjectKey(key, value, object, depth)
                    this.visitObjectValue(value, key, object, depth)
                }
            }

            var me  = this
            
            if (this.manualEnum) 
                Joose.A.each([ 'hasOwnProperty', 'valueOf', 'toString', 'constructor' ], function (key) {
                    if (object.hasOwnProperty && object.hasOwnProperty(key)) {
                        var value   = object[ key ]
                        
                        me.visitObjectKey(key, value, object, depth)
                        me.visitObjectValue(value, key, object, depth)
                    }
                })
            
            return object
        },
        
        
        visitJooseInstance : function (value, depth) {
            if (value.meta.hasMethod('toString')) {
                this.write(value.toString())
                
                return value
            }
            
            return this.SUPERARG(arguments)
        },
        
        
        visitDOMElement : function (object, depth) {
            var output  = '&lt;' + object.tagName
            
            if (object.id) output += ' id="' + object.id + '"'
            if (object.className) output += ' class="' + object.className + '"'
            
            this.write(output + '&gt;')
        },
        
        
        visitDOMStringMap : function () {
            this.write('[DOMStringMap]')
        },
        
        
        // the Object.prototype.toString.call(window) for FF
        visitWindow : function () {
            this.write('[window]')
        },
        
        
        // window.location type in FF
        visitLocation : function () {
            this.write('[window.location]')
        }
    },
    
    
    before : {
        visitObject : function () {
            this.write('{')
        },
        
        
        visitArray : function () {
            this.write('[')
        }
    },
    
    
    after : {
        visitObject : function () {
            var result = this.result
            
            if (result[ result.length - 1 ] == ', ') result.pop()
            
            this.write('}')
        },
        
        
        visitArray : function () {
            var result = this.result
            
            if (result[ result.length - 1 ] == ', ') result.pop()
            
            this.write(']')
        },
        
        
        visitObjectValue : function () {
            this.write(', ')
        },
        
        
        visitArrayEntry : function () {
            this.write(', ')
        }
    },
    
    
    my : {
        
        has : {
            HOST        : null
        },
        
        
        methods : {
            
            stringify : function (value, maxDepth) {
                var visitor     = new this.HOST({
                    maxDepth        : maxDepth || 4
                })
                
                visitor.visit(value, 0)
                
                return visitor.result.join('')
            }
        }
    }
})
