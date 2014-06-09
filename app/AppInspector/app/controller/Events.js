/**
 * @class   AI.controller.Events
 * @extends Ext.app.Controller
 */
Ext.define('AI.controller.Events', {
    extend : 'Ext.app.Controller',

    requires : [
        'AI.util.extjs.Events',
        'AI.util.touch.Events',
        'AI.util.InspectedWindow'
    ],

    models : [
        'Event'
    ],
    stores : [
        'Events'
    ],
    views  : [
        'Events'
    ],

    init : function (application) {
        var me = this;

        me.task = new Ext.util.DelayedTask(me.highlightFilteredRecords);

        me.control({
            '#EventInspector button#ClearEvents'   : {
                'click' : me.onClearEventsClick
            },
            '#EventInspector button#RecordEvents'  : {
                'click' : me.onRecordEventsClick
            },
            '#EventInspector button#StopRecording' : {
                'click' : me.onStopRecordingClick
            },
            'filterfield#FilterEventsList'         : {
                'applyfilter' : me.onFilterEvents,
                'change'      : me.onFilterChange
            }
        });
    },

    onFilterEvents : function (field, value) {
        var grid = field.up('#EventInspector'),
            store = grid.getStore();

        store.clearFilter();

        if (value !== '') {
            store.filter([
                {
                    anyMatch      : true,
                    caseSensitive : false,
                    property      : 'eventName',
                    value         : value
                }
            ]);
        }
    },

    onClearEventsClick : function (btn) {
        var me = this,
            store = Ext.getStore('Events');

        store.removeAll();
    },

    onRecordEventsClick : function (btn) {
        var me = this,
            store = Ext.getStore('Events'),
            util;

        btn.hide();
        btn.next().show();

        if (me.getApplication().info.framework === 'ext') {
            util = AI.util.extjs.Events.recordEvents;
        }
        else {
            util = AI.util.touch.Events.recordEvents;
        }

        var getEvents = function () {
            if (!me.recording) { return; }

            AI.util.InspectedWindow.eval(
                util,
                null,
                function (events) {
                    store.add(events);

                    requestAnimationFrame(getEvents);
                }
            );
        };

        me.recording = true;
        requestAnimationFrame(getEvents);
    },

    onStopRecordingClick : function (btn) {
        var me = this,
            util;

        me.recording = false;

        btn.prev().show();
        btn.hide();

        if (me.getApplication().info.framework === 'ext') {
            util = AI.util.extjs.Events.stopEvents;
        }
        else {
            util = AI.util.touch.Events.stopEvents;
        }

        AI.util.InspectedWindow.eval(
            util,
            null,
            Ext.emptyFn
        );
    },

    highlightFilteredRecords : function (field, value) {
        var grid = field.up('#EventInspector'),
            selModel = grid.getSelectionModel(),
            store = grid.getStore(),
            indices;

        selModel.deselectAll();

        if (value === '') {
            return;
        }

        indices = store.findAll('eventName', value, true);

        Ext.each(indices, function (index) {
            selModel.select(index, true, true);
        });
    },

    onFilterChange : function (field, newValue, oldValue, eOpts) {
        this.task.delay(500, null, this, [field, newValue]);
    }

});
