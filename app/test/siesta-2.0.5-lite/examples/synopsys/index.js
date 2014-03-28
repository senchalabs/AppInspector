var Harness = Siesta.Harness.Browser.ExtJS

Harness.configure({
    title     : 'Awesome Test Suite',
    
    preload : [
        'http://cdn.sencha.io/ext/gpl/4.2.0/resources/css/ext-all.css',
        'http://cdn.sencha.io/ext/gpl/4.2.0/ext-all-debug.js',
        
        'preload.js'
    ]
})


Harness.start(
    '010_sanity.t.js',
    '020_basics.t.js'
)

