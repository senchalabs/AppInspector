StartTest(function(t) {
    t.diag('Monkey Testing');

    $('body').append('<p class="foo">Click here</p>');
    $('body').append('<p class="foo">Click here</p>');
    $('body').append('<p class="foo">Click here</p>');
    $('body').append('<p class="foo">Click here</p>');
    
//    // uncomment this line to enable the hypotetical hidden bug in the application - clicking
//    // on some element throws an exception
//    // and let the wild monkey find it! :)
//    $('body').append('<p onclick="throw \'foo\'" style="background:red; height : 200px" class="bug">BUG</p>');

    $('p.foo').css('background', 'lightgreen').css('height', '30px');
    
    t.monkeyTest(document.body, 5, 'Wild monkeys could not produce any exceptions.', function () {
    });
});