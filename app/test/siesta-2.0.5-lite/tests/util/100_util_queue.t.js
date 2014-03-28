StartTest(function(t) {

    //==================================================================================================================================================================================
    t.diag("Sanity")

    // Siesta.Util.Queue here is a queue from the preload files, no need to start a new test
    t.ok(Siesta.Util.Queue, 'Siesta.Util.Queue is here')

    //==================================================================================================================================================================================
    t.diag("Sync queue - interval 0")

    var report1      = []

    var queue1 = new Siesta.Util.Queue({

        deferer     : setTimeout,
        interval    : 0,

        processor   : function (data, index, self) {
            report1.push({
                data    : data,
                index   : index
            })
        }
    })

    var expectedReport1      = []

    for (var i = 0; i < 50; i++) {
        queue1.addStep({
            stepNum     : i
        })

        expectedReport1.push({
            data        : {
                stepNum     : i
            },
            index       : i
        })
    }

    var isBefore = true

    queue1.run(function () {
        t.ok(isBefore, '"run" callback of synchronouse queue is called syncronously')
    })

    isBefore = false

    t.isDeeply(report1, expectedReport1, 'Sync queue processed correctly')


    //==================================================================================================================================================================================
    t.diag("Async queue")

    var report2      = []

    var queue2 = new Siesta.Util.Queue({

        deferer     : setTimeout,
        interval    : 1,

        processor   : function (data, index, self) {
            report2.push({
                data    : data,
                index   : index
            })
        }
    })

    var expectedReport2      = []

    for (var i = 0; i < 50; i++) {
        queue2.addStep({
            stepNum     : i
        })

        expectedReport2.push({
            data        : {
                stepNum     : i
            },
            index       : i
        })
    }

    var async2      = t.beginAsync()

    queue2.run(function () {
        t.endAsync(async2)

        t.isDeeply(report2, expectedReport2, 'Async queue processed correctly')
    })

    //==================================================================================================================================================================================
    t.diag("Async queue & abort")

    var report3      = []

    var queue3 = new Siesta.Util.Queue({

        deferer         : setTimeout,
        deferClearer    : clearTimeout,
        interval        : 1,

        processor   : function (data, index, self) {
            if (index == 25) { queue3.abort(); return }

            if (index > 25) t.fail("Should never reach this")

            report3.push({
                data    : data,
                index   : index
            })
        }
    })

    var expectedReport3      = []

    for (var i = 0; i < 50; i++) {
        queue3.addStep({
            stepNum     : i
        })

        if (i < 25)
            expectedReport3.push({
                data        : {
                    stepNum     : i
                },
                index       : i
            })
    }

    var async3      = t.beginAsync()

    queue3.run(function () {
        t.endAsync(async3)

        t.isDeeply(report3, expectedReport3, 'queue aborted correctly')
    })
})