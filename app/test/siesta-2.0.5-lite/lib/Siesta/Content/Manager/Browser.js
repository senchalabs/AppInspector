/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Content.Manager.Browser', {
    
    isa     : Siesta.Content.Manager,
    
    has : {
//        baseUrl             : window.location.href.replace(/\?.*$/,'').replace(/\/[^/]*$/, '/'),
//        baseHost            : window.location.host,
//        baseProtocol        : window.location.protocol
    },
    
    
    methods : {
        
        // TODO check that URL can be actully fetched with XHR (same origin)
        load : function (url, onsuccess, onerror) {
            var req = new JooseX.SimpleRequest()
            
            try {
                req.getText(url, true, function (success, text) {
                    
                    if (!success) { 
                        onerror(this + " not found") 
                        return 
                    }
                    
                    onsuccess(text)
                })
            } catch (e) {
                onerror(e)
            }
        }
    }
})

