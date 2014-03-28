StartTest({
    preload : [
        // Jquery CDN
        'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.4.min.js'
    ]
}, function (t) {
    t.diag('Testing simple for loop...');

    // If you find a global leak, you can use this trick to catch it (uncomment the for loop below first, and run in a modern browser)
//    Object.defineProperty(window, 'i', {
//        set : function() { debugger; }
//    })

    // Since this test is preloading jQuery, we should let Siesta know what to 'expect'
    t.expectGlobals('$', 'jQuery');

//    // try to uncomment this line to see the report about unexpected global - "i"
//    // please note: this feature is not supported in IE <= 8
//    for (i = 0; i < 10; i++) {}
    
    t.pass('For loop executed ok, no exceptions.');
    
    $('body').html('JQuery was here');

    t.like(document.body.innerHTML, 'JQuery was here', 'Found correct text in DOM');
});
