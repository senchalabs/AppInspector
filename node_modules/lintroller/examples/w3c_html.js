var LintRoller = require('../src/LintRoller.js');

var config = {
    verbose    : false,

    stopOnFirstError: false,
    regex : /\.html$/i, //only look at HTML files

    logFile          : {
        name : './error.log',
        type : 'text'
    },

    //recursively include JS files in these folders
    filepaths  : [
        './'
    ],

    linters : [
        {
            type : 'w3c_html'
        }
    ]
};

LintRoller.init(config);