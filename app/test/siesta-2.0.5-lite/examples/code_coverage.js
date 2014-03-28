var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title                   : 'Siesta Code Coverage Example',
    
    enableCodeCoverage      : true,
    coverageUnit            : 'extjs_class', // can be "file" or "extjs_class"

    autoCheckGlobals        : true,
    expectedGlobals         : [
        'My'
    ],
    
    preload     : [
//        "http://cdn.sencha.io/ext/gpl/4.2.0/resources/css/ext-all.css",
//        "http://cdn.sencha.io/ext/gpl/4.2.0/ext-all-debug.js",
        "../../extjs-4.2.0/resources/css/ext-all.css",
        "../../extjs-4.2.0/ext-all-debug.js",
        {
            url         : "code_coverage/several_classes_in_one_file.js",
            instrument  : true
        },
        {
            url         : "code_coverage/some_folder/preload_file.js",
            instrument  : true
        },
        {
            url         : "code_coverage/some_folder/folder2/preload_file.js",
            instrument  : true
        }
    ],
    
    viewDOM                 : true
});

Harness.start(
    {
        group               : 'Static loading',
        
        items       : [
            'code_coverage/010_range.t.js',
            'code_coverage/020_event.t.js'
        ]
    },
    {
        group               : 'Dynamic loading',
        
        loaderPath  : {
            My      : 'code_coverage/lib/My'
        },
        
        preload     : [
            "../../extjs-4.2.0/resources/css/ext-all.css",
            "../../extjs-4.2.0/ext-all-debug.js",
            {
                url         : "code_coverage/several_classes_in_one_file.js",
                instrument  : true
            }
//            ,
//            "http://cdn.sencha.io/ext/gpl/4.2.0/resources/css/ext-all.css",
//            "http://cdn.sencha.io/ext/gpl/4.2.0/ext-all-debug.js"
        ],
        
        items       : [
            'code_coverage/030_loader.t.js'
        ]
    }
    
);
// eof Harness.start
