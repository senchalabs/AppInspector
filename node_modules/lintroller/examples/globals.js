var LintRoller = require('../src/LintRoller');

var config = {
    verbose          : false,
    stopOnFirstError : false,

    logFile    : {
        name : './error.log',
        type : 'text'
    },

    //recursively include JS files in these folders
    filepaths  : [
        '../'
    ],

    //but ignore anything in these folders
    exclusions : [
        '../.git/',
        '../node_modules/',
        '../assets/',
        '../docs/',
        '../hooks'
    ],

    linters : [
        {
            type : 'jsLint',

            options : {

                //JSLint defines global vars via the "predef" option
                predef : [
                    'describe',
                    'beforeEach',
                    'afterEach',
                    'it',
                    'expect',
                    'spyOn'
                ]
            }
        },
        {
            type : 'jsHint',

            options : {

                devel   : true,
                node    : true,

                //JSHint defines global vars via the "globals" option
                globals : {
                    'describe'   : true,
                    'beforeEach' : true,
                    'afterEach'  : true,
                    'it'         : true,
                    'expect'     : true,
                    'spyOn'      : true,
                    'require'    : true,
                    'module'     : true
                }
            }
        }
    ]
};

LintRoller.init(config);