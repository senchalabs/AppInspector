/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Content.Preset', {
    
    has : {
        preload                 : Joose.I.Array,
        
        resources               : Joose.I.Array
    },
    
    
    methods : {
        
        initialize : function () {
            var me              = this
            
            Joose.A.each(this.preload, function (preloadDesc) {
                
                me.addResource(preloadDesc)
            })
        },
        
        
        isCSS : function (url) {
            return /\.css(\?.*)?$/i.test(url)
        },
        
        
        getResourceFromDescriptor : function (desc) {
            var constructor, config
            
            var CSS
            
            if (typeof desc == 'string') {
                constructor     = this.isCSS(desc) ? Siesta.Content.Resource.CSS : Siesta.Content.Resource.JavaScript
                
                config          = { url     : desc }
            } else if (desc.text) {
                constructor     = Siesta.Content.Resource.JavaScript
                config          = { content : desc.text }
                
            } else {
                if (!desc.url && !desc.content) throw "Incorrect preload descriptor:" + desc
                
                constructor     = desc.type && desc.type == 'css' || this.isCSS(desc.url) ? Siesta.Content.Resource.CSS : Siesta.Content.Resource.JavaScript
                
                config          = {}
                
                if (desc.url)           config.url          = desc.url
                if (desc.content)       config.content      = desc.content
                if (desc.instrument)    config.instrument   = desc.instrument
            }
            
            return new constructor(config)
        },
        
        
        addResource : function (desc) {
            var resource    = (desc instanceof Siesta.Content.Resource) && desc || this.getResourceFromDescriptor(desc)
            
            this.resources.push(resource)
            
            return resource
        },
        
        
        eachResource : function (func, scope) {
            return Joose.A.each(this.resources, func, scope || this)
        },
        
        
        // deprecated - seems preset doesn't need to know about scope providers
        prepareScope : function (scopeProvider, contentManager) {
            
            this.eachResource(function (resource) {
                
                if (contentManager.hasContentOf(resource))
                    scopeProvider.addPreload({
                        type        : (resource instanceof Siesta.Content.Resource.CSS) ? 'css' : 'js', 
                        content     : contentManager.getContentOf(resource)
                    })
                else 
                    scopeProvider.addPreload(resource.asDescriptor())
            })
        }
    }
        
})

