var Harness = Siesta.Harness.Browser;

Harness.configure({
    title     : 'Awesome Test Suite',
    
    testClass           : Siesta.Test.jQuery,

    preload : [
        // Jquery CDN
        'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.1.js'
    ]
})


Harness.start(
    '010_hello_world.t.js',
    {
        hostPageUrl         : '020_jquery_ui.html',
        
        preload             : 'inherit',
        
        alsoPreload         : [
            'http://ajax.microsoft.com/ajax/jquery.ui/1.8.16/jquery-ui.js',
            'http://ajax.microsoft.com/ajax/jquery.ui/1.8.16/themes/black-tie/jquery-ui.css'
        ],
        url                 : '020_jquery_ui_selectable.t.js'
    },
    {
        url : '030_monkey.t.js'
    }
)

