StartTest(function(t) {
    // in this test we press ENTER on the <a> element, which should also trigger it's "click" event
    // the onkeypress handler of the element hides the <a> and "click" event should not update the current cursor position

    t.testBrowser(function (t) {
        document.body.innerHTML     = '<a href="javascript:void(0)" id="anchor">Click me</a>';
        var anchor                  = document.getElementById('anchor');
        
        anchor.onkeypress           = function () {
            anchor.style.position   = 'absolute'
            anchor.style.left       = '-1000px'
            anchor.style.top        = '-1000px'
        }
        
        t.firesOk(anchor, 'click', 1)
        
        var prevCurrentPosition     = t.currentPosition.slice()

        t.chain(
            {
                action      : 'type',
                target      : '#anchor',
                text        : '[ENTER]'
            },
            function () {
                t.isDeeply(t.currentPosition, prevCurrentPosition, "Current cursor position has not changed")
            }
        )
    });
});

