/**
 *
 */
Ext.define('AI.view.layouts.tab.BoxLayoutsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.boxlayouts',

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
        var grid = btn.up('boxlayouts'),
            store = grid.getStore(),
            util;
        grid.setLoading('Profiling for overnested box layouts...');

        this.getViewModel().set('selected', false);

        if (AI.getApplication().info.framework === 'ext') {
            util = AI.util.extjs.Profile.getNestedBoxLayouts;
        } else {
            util = AI.util.touch.Profile.getNestedBoxLayouts;
        }

        AI.util.InspectedWindow.eval(
            util,
            null,
            function(components) {
                var cmps = [];

                store.removeAll();

                Ext.each(components, function(component) {
                    cmps.push(Ext.create('AI.model.layouts.Layout', component));
                });

                store.setData(cmps);
                grid.setLoading(false);

                // FIXME    - here is a strange situation
                // on the first load nothing shows up
            }
        );
    },

    /**
     *
     */
    onHelpClick: function(button, e) {
        var msg = AI.util.i18n.getMessage;

        Ext.Msg.alert(
            msg('Box Layouts'),
            msg(
                'Utility to find nested box layouts inside the application which may contribute to performance issues.'
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
