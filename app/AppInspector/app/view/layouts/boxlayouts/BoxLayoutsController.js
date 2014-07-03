/**
 * @class   AI.view.layouts.boxlayouts.BoxLayoutsController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.layouts.boxlayouts.BoxLayoutsController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.boxlayouts',

    requires: [
        'AI.model.Base',
        'AI.util.extjs.Profile',
        'AI.util.touch.Profile',
        'AI.util.InspectedWindow'
    ],

    mixins: [
        'AI.mixin.Localize'
    ],

    /**
     * @param   {AI.view.layouts.boxlayouts.BoxLayouts} grid
     */
    onActivate: function (grid) {
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
     * @param   {Ext.button.Button} btn
     */
    onRefreshClick: function (btn) {
        var grid = btn.up('boxlayouts'),
            store = this.getStore('BoxLayouts'),
            util;

        store.removeAll();
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
            function (components) {
                var cmps = [];

                Ext.each(components, function (component) {
                    cmps.push(Ext.create('AI.model.Base', component));
                });

                store.setData(cmps);
                grid.setLoading(false);
            }
        );
    },

    /**
     * help click event handler
     */
    onHelpClick: function () {
        var msg = AI.util.i18n.getMessage;

        Ext.Msg.alert(
            msg('Box Layouts'),
            msg(
                'Utility to find nested box layouts inside the application which may contribute to performance issues.'
            )
        );
    },

    /**
     * @param   {Ext.selection.Model}   selModel
     * @param   {Ext.data.Model}        record
     */
    onSelect: function (selModel, record) {
        var layouts = this.getView().up('tabpanel');

        this.getViewModel().set('selected', record);

        // we delegate to parent
        layouts.fireEvent('layoutselect', record);
    },

    /**
     * delegate to main view
     *
     * @fires   revealcmp
     */
    onRevealClick: function () {
        var main = this.getView().up('main'),
            record = this.getViewModel().get('selected');

        main.fireEvent('revealcmp', record, main);
    }
});
