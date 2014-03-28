StartTest(function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Clicking on the elements inside of the iframe");
    
    // seems in IE, iframes are added to global scope under index
    t.expectGlobal('0')
    
    t.testExtJS(function (t) {
        
        var iframe          = document.createElement('iframe')

        iframe.style.margin  = '50px'
        iframe.style.width  = '300px'
        iframe.style.height = '300px'
        iframe.src          = 'about:blank'
        
        var async           = t.beginAsync()
        
        var cont            = function () {
            t.endAsync(async)
            
            var iframeDoc       = iframe.contentWindow.document
            
            var div             = iframeDoc.createElement('div')
            
            div.setAttribute('style', 'width : 100px; height : 100px; left : 100px; top : 100px; position : absolute; border : 1px solid black')
            div.innerHTML       = 'INNER'
            
            var input           = iframeDoc.createElement('input')
            
            iframeDoc.body.appendChild(div)
            iframeDoc.body.appendChild(input)
            
            var counter         = 0
            
            div.onclick = function (e) {
                t.isApprox(e.clientX, 150, 1, 'event coordinates should always be local to containing frame');
                t.isApprox(e.clientY, 150, 1, 'event coordinates should always be local to containing frame');
                counter++
            }
            
            t.chain(
                {
                    action      : 'click',
                    target      : div
                },
                function (next) {
                    t.is(counter, 1, 'One click event detected')
                    t.isApprox(t.currentPosition[0], 200, 1, 'Current X-position should be relative to top scope');
                    t.isApprox(t.currentPosition[1], 200, 1, 'Current Y-position should be relative to top scope');

                    next()
                },
                {
                    action      : 'type',
                    target      : input,
                    text        : 'foobar'
                },
                function (next) {
                    t.is(input.value, 'foobar', 'Correct text typed in the input field');
                }
            )
        }
        
        if (iframe.attachEvent) 
            iframe.attachEvent('onload', cont)
        else
            iframe.onload = cont
            
        document.body.appendChild(iframe)
    });
});

