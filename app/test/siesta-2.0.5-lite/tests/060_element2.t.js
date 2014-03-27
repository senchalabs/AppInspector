StartTest(function(t) {

    t.$('body').append('<div id="div"></div>');
    t.$('body').append('<div id="div2">a</div>');


    t.expectPass(function(t) {
        t.elementIsEmpty('#div')

        t.$('#div')[0].innerHTML = "   ";
        t.elementIsEmpty('#div')
    })

    t.expectFail(function(t) {
        t.elementIsEmpty('#div2')
    })
});
