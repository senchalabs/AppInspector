var Harness = Siesta.Harness.Browser.ExtJS

Harness.configure({
    title     : 'Awesome Test Suite',
    
    preload : [
        "http://cdn.sencha.io/ext/gpl/4.2.0/resources/css/ext-all.css",
        "http://cdn.sencha.io/ext/gpl/4.2.0/ext-all-debug.js"
    ]
})


Harness.start(
    '010_basic_form.t.js',
    '020_checkboxes.t.js'
)

