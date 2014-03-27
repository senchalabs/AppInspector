StartTest(function (t) {
    t.expectGlobal('Gnt');

    function getRecorderManager() {
        var recorderManager = new Siesta.Recorder.RecorderPanel({
            width    : 600,
            height   : 300,
            renderTo : document.body
        });
        recorderManager.attachTo(t);

        var recorder = recorderManager.recorder;

        recorder.ignoreSynthetic = false;
        recorder.start();

        return recorderManager;
    }

    var taskStore = Ext.create("Gnt.data.TaskStore", {
        root : {
            expanded : true,
            children : [
                {
                    Id        : 'Sencha',
                    leaf      : false,
                    Name      : 'Sencha Releases',
                    StartDate : '2010-01-18T00:00:00',
                    Duration  : 8,
                    expanded  : 1,
                    cls       : 'Sencha',
                    children  : [
                        {
                            expanded  : 1,
                            StartDate : '2010-01-18T00:00:00',
                            Duration  : 8,
                            Id        : 2,
                            leaf      : false,
                            Name      : 'Ext 4.x branch',
                            children  : [
                                {
                                    Duration  : 3,
                                    StartDate : '2010-01-18T00:00:00',
                                    Id        : 3,
                                    leaf      : true,
                                    Name      : 'Ext JS 4.0.1'
                                },
                                {
                                    Duration  : 2,
                                    StartDate : '2010-01-21T00:00:00',
                                    Id        : 4,
                                    leaf      : true,
                                    Name      : 'Ext JS 4.0.2'
                                },
                                {
                                    Duration  : 3,
                                    StartDate : '2010-01-25T00:00:00',
                                    Id        : 5,
                                    leaf      : true,
                                    Name      : 'Ext JS 4.0.3'
                                }
                            ]
                        }
                    ]
                },
                {
                    expanded    : 1,
                    StartDate   : '2010-01-28T00:00:00',
                    Duration    : 3,
                    PercentDone : 50,
                    Id          : 'Bryntum',
                    cls         : 'Bryntum',
                    leaf        : false,
                    Name        : 'Bryntum Releases',
                    children    : [
                        {
                            Duration    : 3,
                            PercentDone : 50,
                            StartDate   : '2010-01-28T00:00:00',
                            Id          : 13,
                            leaf        : true,
                            Name        : 'Product X'
                        },
                        {
                            Duration    : 4,
                            PercentDone : 30,
                            StartDate   : '2010-02-05T00:00:00',
                            Id          : 14,
                            leaf        : true,
                            Name        : 'Ext Gantt 2.0'
                        },
                        {
                            Duration    : 4,
                            PercentDone : 10,
                            StartDate   : '2010-02-09T00:00:00',
                            Id          : 15,
                            leaf        : true,
                            Name        : 'Ext Scheduler 2.0'
                        }
                    ]
                },
                {
                    Id   : 33,
                    leaf : true,
                    Name : 'Unplanned task 1'
                },
                {
                    Id   : 34,
                    leaf : true,
                    Name : 'Unplanned task 11'
                },
                {
                    Id   : 35,
                    leaf : true,
                    Name : 'Unplanned task 2.0'
                },
                {
                    Id   : 43,
                    leaf : true,
                    Name : 'Unplanned task 14'
                },
                {
                    Id   : 44,
                    leaf : true,
                    Name : 'Unplanned task 3'
                },
                {
                    Id   : 45,
                    leaf : true,
                    Name : 'Unplanned task 4'
                }
            ]
        }
    });

    t.it('gantt without id', function(t) {
        var gantt = Ext.create('Gnt.panel.Gantt', {
            height                  : 200,
            width                   : 500,
            renderTo                : document.body,
            leftLabelField          : 'Name',
            enableProgressBarResize : true,
            cascadeChanges          : true,
            startDate               : new Date(2010, 0, 18),
            endDate                 : Sch.util.Date.add(new Date(2010, 0, 18), Sch.util.Date.WEEK, 5),
            viewPreset              : 'weekAndDayLetter',

            eventRenderer : function (taskRecord) {
                return {
                    ctcls : taskRecord.get('Id') // Add a CSS class to the task element
                };
            },

            viewConfig : {
                getRowClass : function (r) {
                    return 'ID-' + r.data.Id;
                }
            },

            // Setup your static columns
            columns    : [
                {
                    xtype : 'namecolumn',
                    width : 160
                },
                {
                    xtype : 'startdatecolumn',
                    width : 70
                },
                {
                    xtype : 'enddatecolumn',
                    width : 70
                },
                {
                    xtype : 'percentdonecolumn'
                },
                {
                    xtype : 'earlystartdatecolumn',
                    width : 70
                },
                {
                    xtype : 'earlyenddatecolumn',
                    width : 70
                },
                {
                    xtype : 'latestartdatecolumn',
                    width : 70
                },
                {
                    xtype : 'lateenddatecolumn',
                    width : 70
                },
                {
                    xtype : 'slackcolumn',
                    width : 70
                }
            ],

            taskStore        : taskStore,
            lockedGridConfig : {
                width : 150
            },
            lockedViewConfig : {
                plugins : {
                    ptype           : 'treeviewdragdrop',
                    containerScroll : true
                }
            }
        });

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain([
            { waitFor : 'selector', args : ['.sch-gantt-item', gantt.el] },

            { action : "drag", target : gantt.down('splitter'), by : [-50, 0], offset : [0, 20] },

            { action : "moveCursorTo", target : ".ID-3 > .sch-timetd .sch-gantt-task-bar", offset : [20, 10] },

            { waitFor : 4000 },

            { action : "mousedown", target : ".ID-3 > .sch-timetd .sch-gantt-terminal-end", offset : [5, 5] },

            { action : "moveCursorTo", target : ".ID-4 > .sch-timetd .sch-gantt-task-bar", offset : [25, 5] },
            { waitFor : 4000 },

            { action : "moveCursorTo", target : ".ID-4 > .sch-timetd .sch-gantt-terminal-start", offset : [5, 5] },

            { action : "mouseup", target : ".ID-4 > .sch-timetd .sch-gantt-terminal-start", offset : [5, 5] },
            { waitFor : 500 },

            // EXPECTATIONS
            function () {
                var steps = recorderManager.generateSteps();

                recorder.stop();

                // Clear the offset object which has some 1px offset, which is irrelevant for this test
                steps = steps.map(function (s) {
                    delete s.offset;
                    return s;
                });

                t.is(steps.length, 6);

                t.isDeeply(steps[0], { action : "drag", target : ">>ganttpanel bordersplitter", by : [-50, 0] })
                t.isDeeply(steps[1], { action : "moveCursorTo", target : "ganttpanel gridpanel => .ID-3 > .sch-timetd .sch-gantt-task-bar" })
                t.isDeeply(steps[2], { action : "mousedown", target : "ganttpanel gridpanel => .ID-3 > .sch-timetd .sch-gantt-terminal-end" })
                t.isDeeply(steps[3], { action : "moveCursorTo", target : "ganttpanel gridpanel => .ID-4 > .sch-timetd .sch-gantt-task-bar" })
                t.isDeeply(steps[4], { action : "moveCursorTo", target : "ganttpanel gridpanel => .ID-4 > .sch-timetd .sch-gantt-terminal-start" })
                t.isDeeply(steps[5], { action : "mouseup", target : "ganttpanel gridpanel => .ID-4 > .sch-timetd .sch-gantt-terminal-start" })
            }

        ]);
    })

    t.it('gantt with id', function(t) {
        var gantt = Ext.create('Gnt.panel.Gantt', {
            height                  : 200,
            width                   : 500,
            id                      : 'ganttchart',
            renderTo                : document.body,
            leftLabelField          : 'Name',
            enableProgressBarResize : true,
            cascadeChanges          : true,
            startDate               : new Date(2010, 0, 18),
            endDate                 : Sch.util.Date.add(new Date(2010, 0, 18), Sch.util.Date.WEEK, 5),
            viewPreset              : 'weekAndDayLetter',

            eventRenderer : function (taskRecord) {
                return {
                    ctcls : taskRecord.get('Id') // Add a CSS class to the task element
                };
            },

            viewConfig : {
                getRowClass : function (r) {
                    return 'ID-' + r.data.Id;
                }
            },

            // Setup your static columns
            columns    : [
                {
                    xtype : 'namecolumn',
                    width : 160
                },
                {
                    xtype : 'startdatecolumn',
                    width : 70
                },
                {
                    xtype : 'enddatecolumn',
                    width : 70
                },
                {
                    xtype : 'percentdonecolumn'
                }
            ],

            taskStore        : taskStore,
            lockedGridConfig : {
                width : 150
            }
        });

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain([
            { waitFor : 'selector', args : '.sch-gantt-item' },

            { action : "drag", target : ">>#ganttchart-locked-splitter", by : [-50, 0], offset : [0, 20] },

            { action : "moveCursorTo", target : "#ganttchart-3", offset : [20, 10] },

            { waitFor : 4000 },

            { action : "mousedown", target : "#ganttchart-3 .sch-gantt-terminal-end", offset : [5, 5] },

            { action : "moveCursorTo", target : "#ganttchart-4", offset : [25, 5] },
            { waitFor : 4000 },

            { action : "moveCursorTo", target : "#ganttchart-4  .sch-gantt-terminal-start", offset : [5, 5] },

            { action : "mouseup", target : "#ganttchart-4 .sch-gantt-terminal-start", offset : [5, 5] },
            { waitFor : 500 },

            // EXPECTATIONS
            function () {
                var steps = recorderManager.generateSteps();

                recorder.stop();

                // Clear the offset object which has some 1px offset, which is irrelevant for this test
                steps = steps.map(function (s) {
                    delete s.offset;
                    return s;
                });

                t.is(steps.length, 6);

                t.isDeeply(steps[0], { action : "drag", target : ">>#ganttchart-locked-splitter", by : [-50, 0] })
                t.isDeeply(steps[1], { action : "moveCursorTo", target : "#ganttchart-3" })
                t.isDeeply(steps[2], { action : "mousedown", target : "#ganttchart-3 .sch-gantt-terminal-end" })
                t.isDeeply(steps[3], { action : "moveCursorTo", target : "#ganttchart-4" })
                t.isDeeply(steps[4], { action : "moveCursorTo", target : "#ganttchart-4 .sch-gantt-terminal-start" })
                t.isDeeply(steps[5], { action : "mouseup", target : "#ganttchart-4 .sch-gantt-terminal-start" })
            }

        ]);
    })

})