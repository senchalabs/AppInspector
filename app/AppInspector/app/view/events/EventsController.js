/**
 *
 */
Ext.define('AI.view.events.EventsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.events',

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
        task: null
    },

    /**
     *
     */
    beforeInit: function(view) {
        var me = this;

        if (me.getTask() === null) {
            me.setTask(
                new Ext.util.DelayedTask(me.highlightFilteredRecords)
            );
        }
    },

    /**
     *
     */
    destroy: function() {
        var me = this;

        me.setTask(null);

        me.callParent(arguments);
    },

    /**
     *
     */
    onClearEventsClick: function(btn) {
        var vm = this.getViewModel();

        vm.getStore('events').removeAll();
    },

    /**
     *
     */
    onRecordEventsClick: function(btn) {
        var me = this,
            vm = me.getViewModel(),
            store = vm.getStore('events'),
            util,
            getEvents;

        if (AI.getApplication().info.framework === 'ext') {
            util = AI.util.extjs.Events.recordEvents;
        } else {
            util = AI.util.touch.Events.recordEvents;
        }

        /**
         *
         */
        getEvents = function() {
            if (!vm.get('recording')) {
                return;
            }

            AI.util.InspectedWindow.eval(
                util,
                null,
                function(events) {
                    store.add(events);

                    requestAnimationFrame(getEvents);
                }
            );
        };

        vm.set('recording', true);
        requestAnimationFrame(getEvents);
    },

    /**
     *
     */
    onStopRecordingClick: function(btn) {
        var vm = this.getViewModel(),
            util = AI.util.extjs.Profile.stopLayouts;

        AI.util.InspectedWindow.eval(
            util,
            null,
            Ext.emptyFn
        );

        vm.set('recording', false);
    },

    /**
     *
     */
    onFilterEvents: function(field, value) {
        var grid = this.getView(),
            store = grid.getStore();

        store.clearFilter();

        if (value !== '') {
            store.filter([{
                anyMatch: true,
                caseSensitive: false,
                property: 'eventName',
                value: value
            }]);
        }
    },

    /**
     *
     */
    highlightFilteredRecords: function(field, value, grid) {
        var selModel = grid.getSelectionModel(),
            store = grid.getStore(),
            indices;

        selModel.deselectAll();

        if (value === '') {
            return;
        }

        indices = store.findAll('eventName', value, true);

        Ext.each(indices, function(index) {
            selModel.select(index, true, true);
        });
    },

    /**
     *
     */
    onFilterChange: function(field, newValue, oldValue, eOpts) {
        var me = this;

        me.getTask().delay(
            500,
            null,
            me, [field, newValue, me.getView()]
        );
    }
});
