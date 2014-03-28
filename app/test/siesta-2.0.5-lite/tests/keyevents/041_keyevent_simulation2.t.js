StartTest(function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Siesta.Test keyboard simulation");
    
    t.testExtJS(function (t) {
        var box = new Ext.form.TextField({
            width : 400,
            enableKeyEvents : true,
            renderTo : Ext.getBody()
        });

        function testKeyEvents(textField, string, callback, scope) {
            textField.reset();
            var results = {};
            var expected = {};
            var KC = Siesta.Test.Simulate.KeyCodes().keys;
            var generateListener = function(eventName) {
                results[eventName] = {};
                expected[eventName] = {};

                return function(field, e) {
                    if (e.browserEvent.synthetic) {
                        if (eventName === 'keypress') {
                            results[eventName][String.fromCharCode(e.getKey())]++;
                        } else {
                            results[eventName][e.getKey()]++;
                        }
                    }
                    //console.log(eventName + ': ' + e.getKey());
                };
            };

            textField.on('keydown', generateListener('keydown'));
            textField.on('keypress', generateListener('keypress'));
            textField.on('keyup', generateListener('keyup'));
            var c;
            for (var i = 0; i < string.length; i++) {
                c = string.charAt(i);
                
                results.keydown[KC[c.toUpperCase()]] = 0;
                expected.keydown[KC[c.toUpperCase()]] = (expected.keydown[KC[c.toUpperCase()]] || 0) + 1;

                results.keypress[c] = 0;
                expected.keypress[c] = (expected.keypress[c] || 0) + 1;

                results.keyup[KC[c.toUpperCase()]] = 0;
                expected.keyup[KC[c.toUpperCase()]] = (expected.keyup[KC[c.toUpperCase()]] || 0) + 1;
            }

            textField.focus();
            
            t.type(box.inputEl, string, function() {
                t.isDeeply(results.keydown, expected.keydown, "All keydown events fired correctly by input field");
                t.isDeeply(results.keypress, expected.keypress, "All keypress events fired correctly by input field");
                t.isDeeply(results.keyup, expected.keyup, "All keyup events fired correctly by input field");
            
                callback && callback.call(scope || t);
            });
        }

        testKeyEvents(box, "ABC\b", function() {
            t.is(box.getValue(), "AB", "Correct text in input field");

            testKeyEvents(box, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", function() {
                t.is(box.getValue(), "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", "Correct text in input field");
                testKeyEvents(box, ".,", function() {
                    t.is(box.getValue(), ".,", "Correct text in input field");
                    t.done();
                });
            });
        });
    });
});
