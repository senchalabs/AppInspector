//Assumes the script is run from the module's root
process.chdir('hooks');

var LintRoller = require('../src/LintRoller');

var config = {
    verbose          : false,
    stopOnFirstError : false,

    //only check JS files
    regex : /\.(js)$/i,

    //recursively include JS files in these folders
    filepaths        : [
        '../'
    ],

    //but ignore anything in these folders
    exclusions       : [
        '../node_modules/',
        '../assets/',
        '../docs/'
    ],

    linters : [
        {
            type    : 'jsLint',
            options : {
                sloppy : false,
                node   : true,
                todo   : true,

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
            type    : 'jsHint',
            options : {
                strict : true,
                node   : true,

                globals : {
                    'describe'   : true,
                    'beforeEach' : true,
                    'afterEach'  : true,
                    'it'         : true,
                    'expect'     : true,
                    'spyOn'      : true
                }
            }
        },
        {
            type : 'esprima'
        }
//        {
//            type : 'w3c_html'
//        }
    ]
};

try {
    LintRoller.init(config);
}
catch (e) {
    console.log('\nAn error has been caught:\n\n');
    console.log(e);
    process.exit(1);
}