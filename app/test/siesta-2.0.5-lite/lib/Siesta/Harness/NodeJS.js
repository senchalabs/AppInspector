/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Harness.NodeJS
@extends Siesta.Harness 

Class, representing the NodeJS harness. This class reports the output from all test files to console.

This file is a reference only however, for a getting start guide and manual, please refer to <a href="#!/guide/siesta_getting_started">Getting Started Guide</a>.

Synopsys
========

    var Harness,
        isNode        = typeof process != 'undefined' && process.pid
    
    if (isNode) {
        Harness = require('siesta');
    } else {
        Harness = Siesta.Harness.Browser;
    }
        
    
    Harness.configure({
        title     : 'Awesome Test Suite',
        
        transparentEx       : true,
        
        autoCheckGlobals    : true,
        expectedGlobals     : [
            'Ext',
            'Sch'
        ],
        
        preload : [
            "http://cdn.sencha.io/ext-4.0.2a/ext-all-debug.js",
            "../awesome-project-all.js",
            {
                text    : "console.log('preload completed')"
            }
        ]
    })
    
    
    Harness.start(
        // simple string - url relative to harness file
        'sanity.t.js',
        
        // test file descriptor with own configuration options
        {
            url     : 'basic.t.js',
            
            // replace `preload` option of harness
            preload : [
                "http://cdn.sencha.io/ext-4.0.6/ext-all-debug.js",
                "../awesome-project-all.js"
            ]
        },
        
        // groups ("folders") of test files (possibly with own options)
        {
            group       : 'Sanity',
            
            autoCheckGlobals    : false,
            
            items       : [
                'data/crud.t.js',
                ...
            ]
        },
        ...
    )

Running the test suite in NodeJS
================================

To run the suite in NodeJS, launch the harness javascript file:

    > node t/index.js


*/

Class('Siesta.Harness.NodeJS', {
    
    // static
    my : {
        isa         : Siesta.Harness,
        
        does        : Siesta.Role.ConsoleReporter,
        
        has : {
            contentManagerClass     : Siesta.Content.Manager.NodeJS,
            scopeProvider           : 'Scope.Provider.NodeJS',
            
            chdirToIndex            : true
        },
        
        
        before : {
            
            start : function () {
                this.runCore         = 'sequential'
                
                if (this.chdirToIndex) {
                    var indexFile = process.argv[1]
                    
                    var path = require('path')
                    
                    process.chdir(path.dirname(indexFile))
                }
            }
        },
        
        
        methods : {
            
            log     : console.log,
            exit    : process.exit,

            
            getScopeProviderConfigFor : function (desc, launchId) {
                var config = this.SUPER(desc, launchId)
                
                config.sourceURL    = desc.url
                
                return config
            },
            
            
            normalizeURL : function (url) {
                // ref to lib in current dist (no trailing `.js`) 
                if (!/\.js$/.test(url)) {
                    url = '../lib/' + url.replace(/\./g, '/') + '.js'
                }
                
                return url
            }
        }
        
    }
    //eof my
})
//eof Siesta.Harness.NodeJS


