/**
 *
 */
Ext.define('AI.view.layouts.tab.LayoutRunsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.layoutruns',

    requires: [
        'AI.util.extjs.Profile',
        'AI.util.touch.Profile',
        'AI.util.InspectedWindow',
        'AI.util.i18n'
    ],

    onClearLayoutsClick: function(btn) {
        var vm = this.getViewModel();

        vm.set('layoutPool', []);

        vm.getStore('layoutruns').getRootNode().removeAll();
    },

    onRecordLayoutsClick: function(btn) {
        var vm = this.getViewModel(),
            layoutPool = vm.get('layoutPool'),
            tree = this.getView(),
            util = AI.util.extjs.Profile.recordLayouts,
            getLayouts = function() {
                if (!vm.get('recording')) {
                    return;
                }

                AI.util.InspectedWindow.eval(
                    util,
                    null,
                    function(components, isException) {
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

    onStopRecordingClick: function(btn) {
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
     *
     */
    onSelectLayoutRunComponent: function(tree, record, item, index, e, eOpts) {
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
     */
    onRevealClick: function(btn) {
        var main = this.getView().up('main'),
            record = this.getViewModel().get('selected');

        main.fireEvent('revealcmp', record, main);
    },

    /**
     * localize
     */
    localize: function() {
        var view = this.getView(),
            msg = AI.util.i18n.getMessage;

        view.setTitle(msg(view.title));
    }
});
