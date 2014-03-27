/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Util.XMLNode', {
    
    has     : {
        children        : Joose.I.Array,
        
        tag             : { required : true },
        attributes      : Joose.I.Object,
        
        textContent     : null,
        
        escapeTable     : {
            
            init    : {
                '&'     : '&amp;', 
                '<'     : '&lt;', 
                '>'     : '&gt;', 
                '"'     : '&quot;'
            }
        }
        
    },
    
    
    methods : {
        
        escapeXml : function (s) {
            var me = this
            
            return typeof s != 'string' ? s : s.replace(/[&<>"]/g, function (match) {
                return me.escapeTable[ match ]
            })
        },
        
        
        toString : function () {
            var me                  = this
            var childrenContent     = []
            
            Joose.A.each(this.children, function (child) {
                childrenContent.push(child.toString())
            })
            
            var attributesContent       = []
            
            Joose.O.each(this.attributes, function (value, name) {
                attributesContent.push(name + '="' + me.escapeXml(value) + '"')
            })
            
            // to have predictable order of attributes in tests
            attributesContent.sort()
            
            attributesContent.unshift(this.tag)
            
            
            return '<' + attributesContent.join(' ') + '>' + (this.textContent != null ? this.escapeXml(this.textContent) : '') + childrenContent.join('') + '</' + this.tag + '>' 
        },
        
        
        appendChild : function (child) {
            if (child instanceof Siesta.Util.XMLNode)
                child.parent    = this
            else
                child           = new Siesta.Util.XMLNode(Joose.O.extend(child, { parent : this }))
                
            this.children.push(child)
            
            return child
        },
        
        
        setAttribute : function (name, value) {
            this.attributes[ name ] = value
        }
    }
})
