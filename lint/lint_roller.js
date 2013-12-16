var LintRoller = require('lintroller');

var config = {
    verbose          : false,
    stopOnFirstError : false,

    //only check JS files
    regex            : /\.(js)$/i,

    //recursively include JS files in these folders
    filepaths        : [
        '../background.js',
        '../devtools-page.js',

        '../workspace/app.js',
        '../workspace/app/'
    ],

    //but ignore anything in these folders
    exclusions       : [],

    linters : [
//        {
//            type : 'tabs'
//        },
        {
            type    : 'jsHint',
            options : {
                curly  : true, //force the use of curly braces on blocks
                undef  : true, //don't use globals, unless those below...
                eqeqeq : true, //force the usage of === and !==
                evil   : true, //allow eval

                browser : true, //ignore globals defined in the browser
                //devel   : true, //ignore alert, console, etc

                globals : {
                    'Ext'    : true,
                    'AI'     : true,
                    'chrome' : true
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