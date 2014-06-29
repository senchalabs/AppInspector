/**
 *
 */
Ext.define('AI.view.layouts.overnesting.OvernestingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.overnesting',

    requires: [
        'AI.model.layouts.Layout',
        'AI.util.extjs.Profile',
        'AI.util.touch.Profile',
        'AI.util.InspectedWindow'
    ],

    mixins: [
        'AI.mixin.Localize'
    ],

    /**
     *
     */
    onActivate: function(grid) {
        // load the "Components" upfront ...
        var initialLoad = grid.getInitialLoad(),
            btn = grid.lookupReference('profile');

        if (!initialLoad && grid) {
            // ... but only once
            grid.setInitialLoad(true);

            this.onRefreshClick(btn);
        }
    },

    /**
     *
     */
    onRefreshClick: function(btn) {
        var grid = btn.up('overnesting'),
            store = this.getStore('Overnestings'),
            util;

        store.removeAll();
        grid.setLoading('Profiling for overnested components...');

        this.getViewModel().set('selected', false);

        if (AI.getApplication().info.framework === 'ext') {
            util = AI.util.extjs.Profile.getOvernestedComponents;
        } else {
            util = AI.util.touch.Profile.getOvernestedComponents;
        }

        AI.util.InspectedWindow.eval(
            util,
            null,
            function(components) {
                var cmps = [];

                Ext.each(components, function(component) {
                    cmps.push(Ext.create('AI.model.layouts.Layout', component));
                });

                store.setData(cmps);
                grid.setLoading(false);
            }
        );
    },

    /**
     *
     */
    onHelpClick: function(button, e) {
        var msg = AI.util.i18n.getMessage;

        Ext.Msg.alert(
            msg('Overnesting'),
            msg(
                'Utility to find components which may be overnested inside the application.'
            )

        );
    },

    /**
     * we delegate to parent
     */
    onSelect: function(selModel, record, index, eOpts) {
        var layouts = this.getView().up('tabpanel');

        this.getViewModel().set('selected', record);

        layouts.fireEvent('layoutselect', record);
    },

    /**
     * delegate to main view
     */
    onRevealClick: function(btn) {
        var main = this.getView().up('main'),
            record = this.getViewModel().get('selected');

        main.fireEvent('revealcmp', record, main);
    }
});
