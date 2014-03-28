StartTest(function(t) {
    t.expectGlobal('0')

    t.it('Should support contentEditable', function(t) {

        t.chain(
            function(next) {
                document.body.innerHTML += '<div contentEditable="true" style="background:#ccc" class="foo"></div>';
                next();
            },

            { type : 'foot[BACKSPACE]', target : '.foo' },

            function(next) {
                t.is($('.foo')[0].innerHTML, 'foo');
                next()
            }
        )
    })

    t.it('Should support designMode', function(t) {
        var doc
        
        t.chain(
            { waitFor : 1000},

            function (next) {
                t.expectGlobal('iframe1')
                
                var iframe      = document.createElement('iframe')
                
                iframe.id       = 'iframe1'
                iframe.src      = 'about:blank'
                iframe.setAttribute('width', 300)
                iframe.setAttribute('height', 400)
                
                if (iframe.attachEvent) 
                    iframe.attachEvent('onload', next)
                else
                    iframe.onload   = next
                
                document.body.innerHTML = '';
                document.body.appendChild(iframe)
            },
            function (next) {
                doc             = document.getElementById('iframe1').contentWindow.document
                
                doc.designMode  = 'on';

                next();
            },

            { click : '#iframe1' },

            { type : 'bart[BACKSPACE]'/*, target : '#iframe1'*/ },

            function(next) {
                t.todo('Enable when native events are supported', function(t) {
                    t.is(doc.body.innerHTML, 'bar');
                })
            }
        )
    })
});
