var Harness = Siesta.Harness.Browser

Harness.configure({
    title     : 'Awesome Test Suite',
    
    preload : [
        "prototype.js"
    ]
})


Harness.start(
    'hello_world.t.js'
)

