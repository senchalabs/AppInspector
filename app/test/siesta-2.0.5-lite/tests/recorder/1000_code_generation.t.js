StartTest(function (t) {

    function getRecorderManager() {
        var recorderManager = new Siesta.Recorder.RecorderPanel({
            width    : 600,
            height   : 200,
            renderTo : document.body
        });

        return recorderManager;
    }

    t.it('Basic code generation', function (t) {

        var recorderManager = getRecorderManager();

        recorderManager.store.loadData([
            { type : 'click', actionTarget : 'button', offset : [10, 20] },
            { type : 'click', actionTarget : 'button', options : { ctrlKey : true, shiftKey : true, foo : "bar"} },
            { type : 'waitForMs', actionTarget : "300" },
            { type : 'fn', actionTarget : "Ext.getBody().setStyle('background-color', 'black');" }
        ])

        var codeSteps = recorderManager.generateCodeForSteps();

        t.is(codeSteps[0], '{ action : "click", target : "button", offset : [10, 20] }');
        t.is(codeSteps[1], '{ action : "click", target : "button", options : { ctrlKey : true, shiftKey : true, foo : "bar" } }');
        t.is(codeSteps[2], '{ waitFor : "Ms", args : 300 }')

        t.like(codeSteps[3].toString(), "Ext.getBody().setStyle('background-color', 'black');");
        t.like(codeSteps[3].toString(), "next();");
    })
})