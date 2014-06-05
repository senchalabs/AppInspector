/**
 * @class   AI.controller.Layouts
 * @extends Ext.app.Controller
 */
Ext.define('AI.controller.Layouts', {
    extend : 'Ext.app.Controller',

    requires : [
        'AI.util.extjs.Profile',
        'AI.util.touch.Profile',
        'AI.util.InspectedWindow'
    ],

    models : [
        'Overnested'
    ],

    stores : [
        'Overnested',
        'BoxLayouts',
        'Layouts'
    ],

    views : [
        'Layouts'
    ],

    init : function (application) {
        var me = this;

        me.layoutPool = [];

        me.control({
            // overnested profile
            'gridpanel#Overnested'             : {
                'activate' : me.onOvernetedProfileActivate,
                'select'   : me.onSelectOvernestedComponent
            },
            'button#ProfileOvernesting'        : {
                'click' : me.onOvernestedProfileClick
            },
            // nested box layouts
            'gridpanel#BoxLayouts'             : {
                'activate' : me.onNestedBoxLayoutActivate,
                'select'   : me.onSelectOvernestedComponent
            },
            'button#ProfileBoxLayouts'         : {
                'click' : me.onNestedBoxLayoutsClick
            },

            //layout runs
            '#LayoutRuns button#ClearLayouts'  : {
                'click' : me.onClearLayoutsClick
            },
            '#LayoutRuns button#RecordLayouts' : {
                'click' : me.onRecordLayoutsClick
            },
            '#LayoutRuns button#StopRecording' : {
                'click' : me.onStopRecordingClick
            },
            'treepanel#LayoutRuns'             : {
                'itemclick' : me.onSelectLayoutRunComponent
            }
        });
    },

    onOvernetedProfileActivate : function (grid) {
        // load the "Layouts > Overnesting" upfront ...
        var initialLoad = grid.initialLoad,
            btn = grid.down('button#ProfileOvernesting');

        if (!initialLoad && btn) {
            // ... but only once
            grid.initialLoad = true;

            this.onOvernestedProfileClick(btn);
        }
    },

    onOvernestedProfileClick : function (btn) {
        var grid = btn.up('#Overnested'),
            store = grid.getStore();

        store.removeAll();
        grid.setLoading('Profiling for overnested components...');

        var util;

        if (this.getApplication().info.framework === 'ext') {
            util = AI.util.extjs.Profile.getOvernestedComponents;
        }
        else {
            util = AI.util.touch.Profile.getOvernestedComponents;
        }

        AI.util.InspectedWindow.eval(
            util,
            null,
            function (components) {
                Ext.each(components, function (component) {
                    var model = Ext.create('AI.model.Overnested', component);

                    store.add(model);
                });

                grid.setLoading(false);
            }
        );
    },

    onNestedBoxLayoutActivate : function (grid) {
        // load the "Layouts > Box Layouts" upfront ...
        var initialLoad = grid.initialLoad,
            btn = grid.down('button#ProfileBoxLayouts');

        if (!initialLoad && btn) {
            // ... but only once
            grid.initialLoad = true;

            this.onNestedBoxLayoutsClick(btn);
        }
    },

    onNestedBoxLayoutsClick : function (btn) {
        var grid = btn.up('#BoxLayouts'),
            store = grid.getStore();

        store.removeAll();
        grid.setLoading('Profiling for overnested box layouts...');

        var util;

        if (this.getApplication().info.framework === 'ext') {
            util = AI.util.extjs.Profile.getNestedBoxLayouts;
        }
        else {
            util = AI.util.touch.Profile.getNestedBoxLayouts;
        }

        AI.util.InspectedWindow.eval(
            util,
            null,
            function (components) {
                Ext.each(components, function (component) {
                    var model = Ext.create('AI.model.Overnested', component);

                    store.add(model);
                });

                grid.setLoading(false);
            }
        );
    },

    onSelectOvernestedComponent : function (selModel, record, index, eOpts) {
        AI.util.InspectedWindow.eval(
            AI.util.InspectedWindow.highlight,
            record.get('cmpId'),
            Ext.emptyFn
        );
    },

    onClearLayoutsClick : function (btn) {
        var me = this,
            root = Ext.ComponentQuery.query('#LayoutRuns')[0].getRootNode();

        me.layoutPool = [];

        root.removeAll();
    },

    onRecordLayoutsClick : function (btn) {
        var me = this,
            tree = Ext.ComponentQuery.query('#LayoutRuns')[0],
            util = AI.util.extjs.Profile.recordLayouts;

        btn.hide();
        btn.next().show();

        var getLayouts = function () {
            if (!me.recording) { return; }

            AI.util.InspectedWindow.eval(
                util,
                null,
                function (components, isException) {
                    if (components.length > 0) {
                        me.layoutPool = Ext.Array.merge(me.layoutPool, components);

                        tree.getStore().setRootNode({
                            expanded : true,
                            children : Ext.clone(me.layoutPool)
                        });
                    }

                    requestAnimationFrame(getLayouts);
                }
            );
        };

        me.recording = true;
        requestAnimationFrame(getLayouts);
    },

    onStopRecordingClick : function (btn) {
        var me = this,
            util = AI.util.extjs.Profile.stopLayouts;

        me.recording = false;

        btn.prev().show();
        btn.hide();

        AI.util.InspectedWindow.eval(
            util,
            null,
            Ext.emptyFn
        );
    },

    onSelectLayoutRunComponent : function (tree, record, item, index, e, eOpts) {
        AI.util.InspectedWindow.eval(
            AI.util.InspectedWindow.highlight,
            record.get('cmpId'),
            Ext.emptyFn
        );
    }

});
