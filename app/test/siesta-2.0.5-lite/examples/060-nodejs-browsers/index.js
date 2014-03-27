var Harness, testClass;
var isNode        = typeof process != 'undefined' && process.pid;

if (isNode) {
    Harness         = require('../../siesta-nodejs-all')
    testClass       = require('./lib/YourTestClass')
} else {
    Harness         = Siesta.Harness.Browser
    testClass       = YourTestClass
}
        

Harness.configure({
    title       : 'Cross-platform Test Suite',
    
    testClass   : testClass,
    
    preload     : [
        'preload/preload.js'
    ]
})


Harness.start(
    '010_sanity.t.js',
    '020_basic.t.js'
)

