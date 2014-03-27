StartTest(function (t) {

    function getRecorderManager() {
        var recorderManager = new Siesta.Recorder.RecorderPanel({
            width    : 600,
            height   : 200,
            renderTo : document.body
        });
        recorderManager.attachTo(t);

        var recorder = recorderManager.recorder;

        recorder.ignoreSynthetic = false;
        recorder.start();

        return recorderManager;
    }

    Ext.define('Ext.Company', {
        extend : 'Ext.data.Model',
        fields : [
            {name : 'company'},
            {name : 'price', type : 'float'}
        ]
    });
    // Array data for the grids
    Ext.grid.dummyData = [
        ['A', 71.72, 0.02, 0.03, '9/1 12:00am', 'Manufacturing'],
        ['B', 29.01, 0.42, 1.47, '9/1 12:00am', 'Manufacturing'],
        ['C', 83.81, 0.28, 0.34, '9/1 12:00am', 'Manufacturing']
    ];

    var store = Ext.create('Ext.data.ArrayStore', {
        model : 'Ext.Company',
        data  : Ext.grid.dummyData
    });

    var grid1 = Ext.create('Ext.grid.Panel', {
        id         : 'grid',
        store      : store,
        columns    : [
            {text : "Company", flex : 1, width : 100, dataIndex : 'company', tdCls : 'firstCol', editor : { xtype : 'combobox' }},
            {text : "Price", dataIndex : 'price', width : 100, }
        ],
        viewConfig : {
            getRowClass : function (rec) {
                return rec.get('company') === 'C' ? 'FOO' : '';
            }
        },
        plugins    : 'cellediting',
        width      : 300,
        height     : 120,
        iconCls    : 'icon-grid',
        renderTo   : Ext.getBody()
    });

    t.it('Grid column header', function (t) {

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : '#grid gridcolumn[dataIndex=company] => .x-column-header-text' },
            { waitFor : 500 },
            { click : '#grid gridcolumn[dataIndex=company] => .x-column-header-trigger' },
            { waitFor : 500 },
            { click : '>> #descItem' },
            { waitFor : 500 },

            function () {

                var recorderEvents = recorder.getRecordedEvents();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderEvents.length, 3);

                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[1].type, 'click');
                t.is(recorderEvents[2].type, 'click');

                t.is(recorderEvents[0].actionTarget, '#grid gridcolumn[text=Company] => .x-column-header-text');
                t.is(recorderEvents[1].actionTarget, '#grid gridcolumn[text=Company] => .x-column-header-trigger');
                t.is(recorderEvents[2].actionTarget, '#descItem => .x-menu-item-text');
            }
        )
    })

    t.it('Grid rows', function (t) {

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : '#grid => .x-grid-row:nth-child(2) .x-grid-cell:nth-child(2)' },
            { waitFor : 300 },

            { click : '#grid => .FOO .firstCol' },
            { waitFor : 300 },

            function () {

                var recorderEvents = recorder.getRecordedEvents();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderEvents.length, 2);
                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[0].actionTarget, '#grid => .x-grid-row:nth-child(2) > .x-grid-cell:nth-child(2)');

                t.is(recorderEvents[1].type, 'click');
                t.is(recorderEvents[1].actionTarget, '#grid => .FOO > .firstCol');
            }
        )
    })

    t.it('Grid editors 2 clicks', function (t) {

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { waitFor : 'rowsVisible' },

            { doubleclick : '#grid => .x-grid-cell' },

            { waitFor : 300 },

            function () {

                var recorderEvents = recorder.getRecordedEvents();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderEvents.length, 1);
                t.is(recorderEvents[0].type, 'dblclick');
                t.is(recorderEvents[0].actionTarget, '#grid => .FOO > .firstCol');
            }
        )
    })

    t.it('Grid editors 1 click', function (t) {

        var grid1 = Ext.create('Ext.grid.Panel', {
            id         : 'grid2',
            store      : store,
            columns    : [
                {text : "Company", flex : 1, dataIndex : 'company', tdCls : 'firstCol', editor : { xtype : 'combobox' }}
            ],
            viewConfig : {
                getRowClass : function (rec) {
                    return rec.get('company') === 'C' ? 'FOO' : '';
                }
            },

            plugins : { ptype : 'cellediting', clicksToEdit : 1 },

            width    : 300,
            height   : 120,
            renderTo : Ext.getBody()
        });

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { waitFor : 'rowsVisible', args : grid1 },

            { dblclick : '#grid2 => .x-grid-cell' },

            { waitFor : 300 },

            function () {

                var first = recorderManager.store.first();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderManager.store.getCount(), 1);
                t.is(first.data.type, 'dblclick');
                t.is(first.data.actionTarget, '#grid2 => .FOO > .firstCol');
            }
        )
    })

    t.it('Grid column drag', function (t) {

        var grid1 = Ext.create('Ext.grid.Panel', {
            id         : 'grid3',
            store      : store,
            columns    : [
                {text : "Company", width : 100, dataIndex : 'company'},
                {text : "Company", width : 100, dataIndex : 'price'}
            ],

            width    : 300,
            height   : 120,
            renderTo : Ext.getBody()
        });

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { drag : '>>#grid3 [dataIndex=company]', by : [100, 0]},

            { waitFor : 300 },

            function () {

                var first = recorderManager.store.first();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderManager.store.getCount(), 1);
                t.is(first.data.type, 'drag');
                t.is(first.data.actionTarget, '#grid3 gridcolumn[text=Company] => .x-column-header-text');
            }
        )
    })

    t.it('Grid column resize', function (t) {

        var grid1 = Ext.create('Ext.grid.Panel', {
            id         : 'grid4',
            store      : store,
            columns    : [
                {text : "Company", width : 50, dataIndex : 'company'},
                {text : "Price", width : 50, dataIndex : 'price'}
            ],

            width    : 300,
            height   : 120,
            renderTo : Ext.getBody()
        });

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { drag : '>>#grid4 [dataIndex=price]', by : [50, 0], offset : [0, 10]},

            { waitFor : 300 },

            function (next) {

                var first = recorderManager.store.first();

                t.is(recorderManager.store.getCount(), 1);
                t.is(first.data.type, 'drag');
                t.is(first.data.offset[0], 0);
                t.is(first.data.offset[1], 10);

                t.is(first.data.actionTarget, '#grid4 gridcolumn[text=Price] => .x-column-header-inner');
                next()
            },

            { waitFor : 300 },

            { drag : '>>#grid4 [dataIndex=company]', by : [-50, 0], offset : ['100%-4', 10] },

            { waitFor : 300 },

            function (next) {

                var last = recorderManager.store.last();

                t.is(recorderManager.store.getCount(), 2);
                t.is(last.data.type, 'drag');
                t.is(last.data.offset[0], 11);
                t.is(last.data.offset[1], 10);

                t.is(last.data.actionTarget, '#grid4 gridcolumn[text=Company] => .x-column-header-trigger');

               recorder.stop();
            }
        )
    })
})