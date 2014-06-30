/**
 * @class   AI.view.main.MainController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    requires: [
        'AI.util.InspectedWindow'
    ],

    mixins: [
        'AI.mixin.Localize'
    ],

    init: function () {
        // TODO: Remove (After feature is 100% Complete)
        // Author: JGarcia
        // Purpose: Auto select an item on app bootup
        if (window.location.href === 'http://appi/') {
            Ext.Function.defer(function () {
                var componentsView = this.getView().down('components'),
                    componentsTree = componentsView.child('componentstree'),
                    store = componentsTree.getStore(),
                    record = store.getAt(0);

                if (!record) {
                    return;
                }

                componentsView.ownerCt.setActiveItem(componentsView);

                componentsTree.getSelectionModel().select(record);
                componentsTree.fireEvent('itemclick', componentsTree, record);
            }, 500, this);
        }
    },

    /**
     *
     */
    onAppRender: function (main, eOpts) {
        var me = this,
            args = Ext.Array.slice(arguments),
            app = AI.getApplication(),
            tabpanel = main.down('tabpanel');

        main.setLoading('Getting application details...');

        AI.util.InspectedWindow.eval(
            AI.util.InspectedWindow.getAppDetails,
            null,
            function (data) {
                if (data) {
                    if (data.isLoading || !data.versions) {
                        // Need to wait till app has loaded so we can get any info we want
                        setTimeout(function () {
                            me.onAppRender.apply(me, args);
                        }, 75);
                    } else {
                        var versions = data.versions,
                            source = Ext.apply({
                                name: data.name
                            }, versions);

                        app.info = {
                            isMVC: data.isMVC,
                            framework: versions.extjs ? 'ext' : 'touch',
                            version: versions.extjs ? versions.extjs : data.touch
                        };

                        tabpanel.down('#appdetails').setSource(source);
                        tabpanel.down('#layoutruns').setDisabled(app.info.framework === 'touch');
                        tabpanel.child('mvc').setDisabled(!data.isMVC);

                        main.setLoading(false);
                    }
                } else {
                    // mask entire AppInspector body element
                    Ext.getBody().mask(
                        'No Sencha framework found!',
                        'no-framework-mask'
                    );
                }
            }
        );
    },

    /**
     *
     */
    onRevealCmp: function (record, main) {
        var tabs = main.down('#navigation'),
            cmps = tabs.down('components'),
            tree = cmps.down('componentstree'),
            store = tree.getStore();

        tree.on('cmpsloaded', function (tree, components) {
            var found = store.getRootNode().findChild('cmpId', record.get('cmpId'), true);

            if (found) {
                // <debug>
                console.log('path', found.getPath());
                // </debug>

                tree.selectPath(found.getPath());
            }
        }, tree, {
            order: 'after',
            delay: 200,
            single: true
        });

        tabs.setActiveItem(cmps);
    }
});
