StartTest(function (t) {

    document.body.innerHTML = '<div id="div" style="width:50px;height:50px">FOO</div>'

    var div = Ext.get('div');

    new Ext.util.Draggable({
        element : div
    });

    t.it('Should detect dragged element at correct position', function (t) {

        t.isDeeply(div.getXY(), [0,0], 'Div at 0,0 originally')

        t.chain(
            {
                action   : 'drag',
                target   : div,
                by       : [50, 50]
            },

            function(next) {
                t.isDeeply(div.getXY(), [50, 50])
            }
        );
    })
});