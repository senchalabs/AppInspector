/**
 * @class   AI.view.layouts.overnesting.OvernestingController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.layouts.overnesting.OvernestingController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.overnesting',

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
     * @param   {AI.view.layouts.overnesting.Overnesting}   grid
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
            msg('Overnesting'),
            msg(
                'Utility to find components which may be overnested inside the application.'
            )

        );
    },

    /**
     * @param   {Ext.selection.Model}   selModel
     * @param   {Ext.data.Model}        record
     *
     * @fires   layoutselect
     */
    onSelect: function (selModel, record) {
        var layouts = this.getView().up('tabpanel');

        this.getViewModel().set('selected', record);

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
