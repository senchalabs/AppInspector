/**
 * @class   AI.view.mvc.tree.TreeController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.mvc.tree.TreeController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.mvctree',

    requires: [
        'AI.util.extjs.MVC',
        'AI.util.touch.MVC'
    ],

    /**
     *
     */
    onActivate: function (tree, parent) {
        // load the "Components" upfront ...
        var initialLoad = tree.getInitialLoad();

        if (!initialLoad && tree) {
            // ... but only once
            tree.setInitialLoad(true);

            this.onTreeActivate(tree);
        }
    },

    /**
     *
     */
    onTreeActivate: function (tree) {
        var treeStore = tree.getStore(),
            fn;

        tree.setLoading('Loading MVC...');

        if (AI.getApplication().info.framework === 'ext') {
            fn = AI.util.extjs.MVC.getApplication;
        }
        else {
            fn = AI.util.touch.MVC.getApplication;
        }

        AI.util.InspectedWindow.eval(
            fn,
            null,
            function (data) {
                treeStore.setRootNode({
                    expanded: true,
                    children: data
                });

                tree.setLoading(false);
            }
        );
    },

    /**
     *
     */
    onSelect: function (rowmodel, record) {
        var type = record.get('type'),
            view, panel,
            children, i, length,
            cnt, property, grid, store;

        if (type) {
            view = rowmodel.view;
            panel = view.up('mvc');
            children = panel.query('> component');
            i = 1;
            length = children.length;

            panel.suspendLayouts();

            for (; i < length; i++) {
                children[i].hide();
            }

            if (type === 'controller') {
                grid = panel.child('mvclisteners');
                store = grid.getStore();

                grid.show();

                store.removeAll();
                store.add(record.get('eventbus'));
            } else if (type === 'store') {
                cnt = panel.child('mvcrecords');
                property = cnt.child('propertygrid');

                grid = cnt.child('gridpanel');
                store = grid.getStore();

                cnt.show();

                store.removeAll();
                property.setSource({});

                store.getProxy().inspectedStoreId = record.get('id');

                store.load({
                    callback: function () {
                        record.set('count', this.getTotalCount());
                    }
                });
            }

            panel.resumeLayouts(true);
        }
    }
});
