StartTest(function(t) {
    t.expectGlobal('foo');

    var button = new Ext.Button({
        text : 'foo',
        width : 100,
        renderTo    : Ext.getBody()
    });

    t.willFireNTimes(button, 'click', 1);

    t.click(button);
});
