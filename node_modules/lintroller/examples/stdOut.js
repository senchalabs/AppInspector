var LintRoller = require('../src/LintRoller');

var config = {
    stdoutErrors : true,

    verbose          : false,
    stopOnFirstError : false,

    //optionally disable log files
    //logFile    : null,

    //recursively include JS files in these folders
    filepaths  : [
        './'
    ],

    //but ignore anything in these folders
    exclusions : [
        './node_modules/',
        './assets/',
        './docs/'
    ],

    linters : [
        {
            type : 'jsLint'
        },
        {
            type : 'jsHint'
        },
        {
            type : 'esprima'
        }
    ]
};

LintRoller.init(config);
