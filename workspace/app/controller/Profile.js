Ext.define('AI.controller.Profile', {
    extend : 'Ext.app.Controller',

    requires : [
        'AI.store.Overnested',
        'AI.util.Profile'
    ],

    init : function () {
        this.control({
            'ai-view-profile-overnesting' : {
                'afterrender' : this.onOvernestedGridRender,
                'select'      : this.onSelectOvernestedComponent
            },

            'button#ProfileOvernesting' : {
                click : this.onOvernestedProfileClick
            },

            'ai-view-profile-boxlayouts' : {
                'afterrender' : this.onOvernestedGridRender,
                'select'      : this.onSelectOvernestedComponent
            },

            'button#ProfileBoxLayouts' : {
                click : this.onNestedBoxLayoutsClick
            }
        });
    },

    onOvernestedGridRender : function (grid) {
        var newStore = Ext.create('AI.store.Overnested', {});

        grid.reconfigure(newStore);
    },

    onOvernestedProfileClick : function (btn) {
        var grid = btn.up('ai-view-profile-overnesting'),
            store = grid.getStore();

        store.removeAll();
        grid.setLoading('Profiling for overnested components...');

        AI.util.InspectedWindow.eval(
            AI.util.Profile.getOvernestedComponents,
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

    onNestedBoxLayoutsClick : function (btn) {
        var grid = btn.up('ai-view-profile-boxlayouts'),
            store = grid.getStore();

        store.removeAll();
        grid.setLoading('Profiling for overnested box layouts...');

        AI.util.InspectedWindow.eval(
            AI.util.Profile.getNestedBoxLayouts,
            null,
            function (components) {
                Ext.each(components, function (component) {
                    var model = Ext.create('AI.model.Overnested', component);

                    store.add(model);
                });

                grid.setLoading(false);
            }
        );
    }
});