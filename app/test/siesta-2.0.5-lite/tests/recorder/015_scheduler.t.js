describe('Scheduler', function (t) {

    function getRecorderManager() {
        var recorderManager = new Siesta.Recorder.RecorderPanel({
            width  : 600,
            height : 200
        });
        recorderManager.attachTo(t);

        var recorder = recorderManager.recorder;

        recorder.ignoreSynthetic = false;
        recorder.start();

        return recorderManager;
    }

    var recorderManager = getRecorderManager();
    var recorder = recorderManager.recorder;

    var resourceStore = Ext.create('Sch.data.ResourceStore', {
            data : [
                {Id : 'r1', Name : 'Mike'},
                {Id : 'r2', Name : 'Linda'},
                {Id : 'r3', Name : 'Don'}
            ]
        }),

        eventStore = Ext.create('Sch.data.EventStore', {
            data : [
                {Id : 1, ResourceId : 'r1', StartDate : new Date(2011, 0, 1, 10), EndDate : new Date(2011, 0, 1, 12)},
                {Id : 2, ResourceId : 'r2', StartDate : new Date(2011, 0, 1, 12), EndDate : new Date(2011, 0, 1, 13)},
                {Id : 3, ResourceId : 'r3', StartDate : new Date(2011, 0, 1, 14), EndDate : new Date(2011, 0, 1, 16)},
                {Id : 4, ResourceId : 'r1', StartDate : new Date(2011, 0, 1, 16), EndDate : new Date(2011, 0, 1, 18)}
            ]
        });

    var sched = Ext.create("Sch.panel.SchedulerGrid", {
        id         : 'sched',
        height     : 300,
        width      : 600,
        rowHeight  : 35,
        renderTo   : Ext.getBody(),
        viewPreset : 'hourAndDay',
        startDate  : new Date(2011, 0, 1, 6),
        endDate    : new Date(2011, 0, 1, 20),

        // Setup static columns
        columns    : [
            { dataIndex : 'Name' }
        ],

        resourceStore : resourceStore,
        eventStore    : eventStore
    });

    t.it('resizing', function (t) {

        t.chain(
            { waitFor : 'RowsVisible', args : '#sched' },

            { moveCursorTo : '#sched-1' },

            { drag : '#sched-1 .sch-resizable-handle-start', by : [10, 0] },
            { waitFor : 400 },

            function () {
                var store = recorderManager.store;

                t.is(store.getCount(), 1);

                t.is(store.getAt(0).data.type, 'drag')
                t.is(store.getAt(0).data.actionTarget, '#sched-1 .sch-resizable-handle-start')
                t.isDeeply(store.getAt(0).data.by, [10, 0])
            }
        )
    })

    t.it('dragging', function (t) {
        t.chain(
            { waitFor : 'RowsVisible', args : '#sched' },

            { drag : '#sched-1', by : [50, 0] },
            { waitFor : 400 },

            function () {

                var store = recorderManager.store;

                t.is(store.getCount(), 2);

                t.is(store.getAt(1).data.type, 'drag')
                t.is(store.getAt(1).data.actionTarget, '#sched-1 .sch-event-inner')
                t.isDeeply(store.getAt(1).data.by, [50, 0])
            }
        )
    })

    // This should produce a drag caused by the mouseup and mousedown event.
    // No click will be fired since row is redrawn on mouseup
    t.it('creating', function (t) {
        t.chain(

            { waitFor : 'RowsVisible', args : '#sched' },

            { drag :'.sch-timelineview .x-grid-cell', offset : [20, 20], by : [50, 0] },

            { waitFor : 400 },

            function () {
                recorder.stop();

                var store = recorderManager.store;

                t.is(store.getCount(), 3);

                t.is(store.getAt(2).data.type, 'drag')
                t.is(store.getAt(2).data.actionTarget, '#sched-timelineview-record-r1 .sch-timetd')
                t.isDeeply(store.getAt(2).data.by, [50, 0])
            }
        )
    })
})