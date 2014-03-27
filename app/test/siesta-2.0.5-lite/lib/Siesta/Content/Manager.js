/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Content.Manager', {
    
    has : {
        disabled        : false,
        
        presets         : {
            required    : true
        },
        
        urls            : Joose.I.Object,
        
        maxLoads        : 5,
        
        harness         : null
    },
    
    
    methods : {
        
        cache : function (callback, errback, ignoreErrors) {
            if (this.disabled) {
                callback && callback()
                
                return
            }
            
            var urls    = this.urls
            var me      = this
            
            Joose.A.each(this.presets, function (preset) {
                preset.eachResource(function (resource) {
                    if (resource.url) urls[ resource.url ] = null
                })
            })
            
            var loadCount   = 0
            var errorCount  = 0
            
            var urlsArray   = []
            
            Joose.O.each(urls, function (value, url) {
                // if some content has been already provided - skip it from caching
                if (!me.hasContentOf(url)) urlsArray.push(url) 
            })
            
            var total       = urlsArray.length
            
            if (total) {
                
                var loadSingle = function () {
                    if (!urlsArray.length) return
                    
                    var url     = urlsArray.shift()
                    
                    me.load(url, function (content) {
                        if (errorCount) return
                        
                        urls[ url ] = content
                        
                        if (++loadCount == total) 
                            callback && callback()
                        else
                            loadSingle()
                    
                    }, ignoreErrors ? function () {
                        
                        if (++loadCount == total) 
                            callback && callback()
                        else
                            loadSingle()
                        
                    } : function () {
                        errorCount++
                        
                        errback && errback(url)
                    })
                }
                
                // running only `maxLoads` "loading threads" at the same time
                for (var i = 0; i < this.maxLoads; i++) loadSingle()
                
            } else
                callback && callback()
        },
        
        
        load : function (url, callback, errback) {
            throw "abstract method `load` called"
        },
        
        
        addContent : function (url, content) {
            this.urls[ url ]    = content
        },
        
        
        hasContentOf : function (url) {
            if (url instanceof Siesta.Content.Resource) url = url.url
            
            return typeof this.urls[ url ] == 'string'
        },
        
        
        getContentOf : function (url) {
            if (url instanceof Siesta.Content.Resource) url = url.url
            
            return this.urls[ url ]
        }
    }
})

