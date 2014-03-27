var Harness = Siesta.Harness.Browser

Harness.configure({
    title     : 'Awesome Test Suite',
    autoCheckGlobals : true,

    // no files to preload
    preload : [
    ]
})


Harness.start(
    // plain strings - urls
    '010_basic_assertions.t.js',
    '020_async_code.t.js',
    
    // this test contains its configuration as the 1st argument for the StartTest call 
    // (see the test file)
    '030_global_variables.t.js',
    
    '040_todo_tests.t.js',

    '050_wait_for.t.js',

    '060_bdd.t.js'
)

