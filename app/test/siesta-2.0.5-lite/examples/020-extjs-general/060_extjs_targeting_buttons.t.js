StartTest(function (t) {
    function createButton(config) {
        config = Ext.apply({
            renderTo : document.body,
            text : 'Click me',
            scale : 'large'
        }, config);

        var btn = new Ext.Button(config);

        t.willFireNTimes(btn, 'click', 1);

        return btn;
    }

    createButton();
    createButton({ id : 'myButton'});

    var btn3 = createButton({ cls : 'foo'});
    var btn4 = createButton();
    var btn5 = createButton({ id : 'otherBtn'});
    var btn6 = createButton();
    var btn7 = createButton({ some : 'value' });
    var btn7 = createButton({ iconCls : 'cool-icon' });

    t.chain(
        { action : 'click', target : [10, 10] },
        { action : 'click', target : '#myButton' },
        { action : 'click', target : '.foo' },
        { action : 'click', target : btn4 },
        { action : 'click', target : document.getElementById('otherBtn') },
        { action : 'click', target : btn6.getEl() },
        { action : 'click', target : '>> [some=value]' },
        { action : 'click', target : 'button[iconCls=cool-icon] => .cool-icon' }
    )
});