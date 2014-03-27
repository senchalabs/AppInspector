StartTest(function(t) {
    var stack,
        parsed;
        
    var exception

    try {
        a           = b;
    } catch (e) {
        exception   = e
        stack       = e.stack;
        parsed      = t.getStackTrace(e);
    }

    // "stackArray" is presented in PhantomJS
    if (stack && !exception.stackArray) {
        t.isGreater(parsed.length, 1, 'Should find a sane stack');

        Ext.each(parsed, function(line, i) {
            t.ok(line, line)
        });
    }
})