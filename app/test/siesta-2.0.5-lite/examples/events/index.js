var Harness = Siesta.Harness.Browser.ExtJS

var log     = window.console && console.log || function () {}

Harness.configure({
    title     : 'Awesome Test Suite',
    
    preload : [
        'http://cdn.sencha.io/ext/gpl/4.2.0/resources/css/ext-all.css',
        'http://cdn.sencha.io/ext/gpl/4.2.0/ext-all-debug.js',
        
        'preload.js'
    ],
    
    // can provide single event handlers in the special "listeners" config 
    listeners : {
        testsuitestart      : function (event, harness) {
            log('Test suite is starting: ' + harness.title)
        },
        
        testsuiteend        : function (event, harness) {
            log('Test suite is finishing: ' + harness.title)
        },
        
        teststart           : function (event, test) {
            log('Test case is starting: ' + test.url)
        },
        
        testupdate          : function (event, test, result) {
            log('Test case [' + test.url + '] has been updated: ' + result.description + (result.annotation ? ', ' + result.annotation : ''))
        },
        
        testfailedwithexception : function (event, test) {
            log('Test case [' + test.url + '] has failed with exception: ' + test.failedException)
        }
    }
})

// or can subscribe manually
Harness.on('testfinalize', function (event, test) {
    log('Test case [' + test.url + '] has completed')
})


Harness.start(
    '010_sanity.t.js',
    '020_basics.t.js'
)

