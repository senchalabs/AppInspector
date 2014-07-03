/**
 * @class   AI.view.layouts.layoutruns.LayoutRunsController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.layouts.layoutruns.LayoutRunsController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.layoutruns',

    requires: [
        'AI.util.extjs.Profile',
        'AI.util.touch.Profile',
        'AI.util.InspectedWindow'
    ],

    mixins: [
        'AI.mixin.Localize'
    ],

    /**
     * clear click event handler
     */
    onClearLayoutsClick: function () {
        var vm = this.getViewModel();

        vm.set('layoutPool', []);

        vm.getStore('layoutruns').getRootNode().removeAll();
    },

    /**
     * start recording click event handler
     */
    onRecordLayoutsClick: function () {
        var vm = this.getViewModel(),
            layoutPool = vm.get('layoutPool'),
            tree = this.getView(),
            util = AI.util.extjs.Profile.recordLayouts,
            getLayouts = function () {
                if (!vm.get('recording')) {
                    return;
                }

                AI.util.InspectedWindow.eval(
                    util,
                    null,
                    function (components, isException) {
                        if (components.length > 0) {
                            layoutPool = Ext.Array.merge(layoutPool, components);

                            tree.getStore().setRootNode({
                                expanded: true,
                                children: Ext.clone(layoutPool)
                            });

                        }

                        requestAnimationFrame(getLayouts);
                    }
                );
            };

        vm.set('recording', true);
        requestAnimationFrame(getLayouts);
    },

    /**
     * @param   {Ext.button.Button} btn
     *
     * stop recording click event handler
     */
    onStopRecordingClick: function (btn) {
        var vm = this.getViewModel(),
            util = AI.util.extjs.Profile.stopLayouts;

        btn.prev().show();
        btn.hide();

        AI.util.InspectedWindow.eval(
            util,
            null,
            Ext.emptyFn
        );

        vm.set('recording', false);
    },

    /**
     * @param   {AI.view.layouts.layoutruns.LayoutRuns} tree
     * @param   {Ext.data.TreeModel}                    record
     */
    onSelectLayoutRunComponent: function (tree, record) {
        var me = this,
            vm = me.getViewModel();

        if (record.get('cmpId') !== '') {
            vm.set('selected', record);

            me.getView().up('tabpanel').fireEvent('layoutselect', record);
        } else {
            vm.set('selected', false);
        }
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
