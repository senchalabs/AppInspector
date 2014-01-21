//Assumes the script is run from the module's root
process.chdir('hooks');

var LintRoller = require('lintroller');

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

    ],

    linters : [
        {
            type    : 'jsLint',
            options : {
                sloppy : false,
                node   : true,
                todo   : true,

                predef : [

                ]
            }
        },
        {
            type    : 'jsHint',
            options : {
                strict : true,
                node   : true,

                globals : {

                }
            }
        },
        {
            type : 'esprima'
        }
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