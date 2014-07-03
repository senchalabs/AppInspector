/**
 * @class   AI.view.events.EventsController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.events.EventsController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.events',

    requires: [
        'Ext.util.DelayedTask',
        'AI.util.extjs.Events',
        'AI.util.touch.Events',
        'AI.util.InspectedWindow'
    ],

    mixins: [
        'AI.mixin.Localize'
    ],

    config: {
        /**
         * @cfg {Ext.util.DelayedTask}  [task=null]
         */
        task: null
    },

    /**
     * initialize {beforeInit} when view is created
     */
    beforeInit: function () {
        var me = this;

        if (me.getTask() === null) {
            me.setTask(
                new Ext.util.DelayedTask(me.highlightFilteredRecords)
            );
        }
    },

    /**
     * cleanup task property on destroy
     */
    destroy: function () {
        var me = this;

        me.setTask(null);

        me.callParent(arguments);
    },

    /**
     * clear click handler
     */
    onClearEventsClick: function () {
        var vm = this.getViewModel();

        vm.getStore('Events').removeAll();
    },

    /**
     * start recording click event handler
     */
    onRecordEventsClick: function () {
        var me = this,
            vm = me.getViewModel(),
            store = vm.getStore('Events'),
            util,
            getEvents;

        if (AI.getApplication().info.framework === 'ext') {
            util = AI.util.extjs.Events.recordEvents;
        } else {
            util = AI.util.touch.Events.recordEvents;
        }

        getEvents = function () {
            if (!vm.get('recording')) {
                return;
            }

            AI.util.InspectedWindow.eval(
                util,
                null,
                function (events) {
                    store.add(events);

                    requestAnimationFrame(getEvents);
                }
            );
        };

        vm.set('recording', true);
        requestAnimationFrame(getEvents);
    },

    /**
     * stop recording click event handler
     */
    onStopRecordingClick: function () {
        var vm = this.getViewModel(),
            util;

        if (AI.getApplication().info.framework === 'ext') {
            util = AI.util.extjs.Events.stopEvents;
        } else {
            util = AI.util.touch.Events.stopEvents;
        }

        AI.util.InspectedWindow.eval(
            util,
            null,
            Ext.emptyFn
        );

        vm.set('recording', false);
    },

    /**
     * @param {AI.view.field.Filter}    field
     * @param {String}                  value
     */
    onFilterEvents: function (field, value) {
        var grid = this.getView(),
            store = grid.getStore();

        store.clearFilter();

        if (value !== '') {
            store.filter([
                {
                    anyMatch     : true,
                    caseSensitive: false,
                    property     : 'eventName',
                    value        : value
                }
            ]);
        }
    },

    /**
     * @param {AI.view.field.Filter}    field
     * @param {String}                  value
     * @param {AI.view.events.Events}   grid
     */
    highlightFilteredRecords: function (field, value, grid) {
        var selModel = grid.getSelectionModel(),
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

    /**
     * @param {AI.view.field.Filter}    field
     * @param {String}                  newValue
     */
    onFilterChange: function (field, newValue) {
        var me = this;

        me.getTask().delay(
            500,
            null,
            me, [field, newValue, me.getView()]
        );
    }
});
