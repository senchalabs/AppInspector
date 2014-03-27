StartTest(function (t) {

    t.it('Event view', function (t) {
        var editor = new Siesta.Recorder.TargetEditor({
            renderTo : Ext.getBody()
        });

        editor.populate(new Siesta.Recorder.RecordedEvent({
            cq  : 'foo',
            xy  : [10, 20],
            csq : 'somecmp => .bar'
        }))

        t.notOk(editor.getValue())

        t.chain(
            { click : 'targeteditor => .x-form-trigger' },
            { click : 'targeteditor.getPicker() => .x-boundlist-item:contains(foo)' },

            function(next) {
                t.is(editor.getValue(), '>>foo')
                next();
            },

            { click : 'targeteditor => .x-form-trigger' },
            { click : '.x-boundlist-item:contains(10,)' },

            function(next) {
                t.isDeeply(editor.getValue(), [10, 20])

                next();
            },

            { click : 'targeteditor => .x-form-trigger' },
            { click : '.x-boundlist-item:contains(somecmp)' },

            function(next) {
                t.isDeeply(editor.getValue(), 'somecmp => .bar')

                next();
            }
        )
    })
})