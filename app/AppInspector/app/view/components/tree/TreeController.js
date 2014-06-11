/**
 *
 */
Ext.define('AI.view.components.tree.TreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.componentstree',

    requires: [
        'AI.model.components.Detail',
        'AI.util.Component',
        'AI.util.InspectedWindow'
    ],

    /**
     *
     */
    onActivate: function(tree, parent) {
        // load the "Components" upfront ...
        var initialLoad = tree.getInitialLoad();

        if (!initialLoad && tree) {
            // ... but only once
            tree.setInitialLoad(true);

            this.onComponentTreeActivate(tree);
        } else {
            tree.fireEvent('cmpsloaded', tree);
        }
    },

    /**
     *
     */
    onComponentTreeActivate: function(tree) {
        var nodes = [],
            root = tree.getRootNode();

        tree.setLoading('Loading components...');
        root.removeAll();

        AI.util.InspectedWindow.eval(
            AI.util.Component.loadComponentTree,
            null,
            function(components, isException) {
                tree.getStore().setRootNode({
                    expanded: true,
                    children: components
                });

                tree.setLoading(false);
                tree.fireEvent('cmpsloaded', tree);
            }
        );
    },

    /**
     *
     */
    onRefreshClick: function(btn) {
        var parent = btn.up('components'),
            tree = parent.down('componentstree'),
            treeFilter = tree.down('filterfield'),
            treeStore = tree.getStore(),
            // properties details
            propsGrid = parent.down('properties'),
            propsFilter = propsGrid.down('filterfield'),
            propsGridStore = propsGrid.getStore(),
            // method details
            methodGrid = parent.down('methods'),
            methodFilter = methodGrid.down('filterfield'),
            methodGridStore = methodGrid.getStore(),
            // binding details
            bindingsGrid = parent.down('bindings'),
            // bindingsFilter = bindingsGrid.down('filterfield'),
            bindingsGridStore = bindingsGrid.getStore();

        propsGrid.up().setActiveTab(0);
        propsFilter.reset();
        propsGridStore.removeAll();

        methodFilter.reset();
        methodGridStore.removeAll();

        // bindingsFilter.reset();
        bindingsGridStore.removeAll();

        parent.getViewModel().set('componentstree.selected', false);

        treeStore.clearFilter();
        treeFilter.reset();
        this.onComponentTreeActivate(tree);
    },

    /**
     *
     */
    onApplyFilter: function(field, value) {
        var tree = field.up('componentstree'),
            store = tree.getStore();

        store.clearFilter();

        if (value !== '') {
            store.filterBy(function(record, id) {
                var data = record.data,
                    // fuzzy search
                    re = new RegExp(value, 'i'),
                    reText = re.test(data.text),
                    // reCmpId = re.test(data.cmpId),
                    // reItemId = re.test(data.itemId),
                    reXType = re.test(data.xtype);

                return reText || reXType;
                // return reText || reCmpId || reItemId || reXType;
            }, value);
        }
    },

    /**
     *
     */
    onSelectComponent: function(selModel, record) {
        var parent = selModel.view.up('components'),
            // properties details
            propsGrid = parent.down('properties'),
            propsFilter = propsGrid.down('filterfield'),
            propsGridStore = propsGrid.getStore(),
            // method details
            methodGrid = parent.down('methods'),
            methodFilter = methodGrid.down('filterfield'),
            methodGridStore = methodGrid.getStore(),
            // binding details
            bindingsGrid = parent.down('bindings'),
            bindingsFilter = bindingsGrid.down('filterfield'),
            bindingsGridStore = bindingsGrid.getStore();

        propsFilter.reset();
        propsGridStore.removeAll();

        methodFilter.reset();
        methodGridStore.removeAll();

        // bindingsFilter.reset();
        // bindingsGridStore.removeAll();

        AI.util.InspectedWindow.eval(
            AI.util.Component.getInspectedComponent,
            record.get('cmpId'),
            function(result, isException) {
                var properties = [],
                    methods = [],
                    bindings = [];

                if (result) {
                    // properties tab
                    Ext.each(result.properties, function(property) {
                        properties.push(Ext.create('AI.model.components.Detail', property));
                    });

                    propsGridStore.loadData(properties);

                    // methods tab
                    Ext.each(result.methods, function(method) {
                        methods.push(Ext.create('AI.model.components.Detail', method));
                    });

                    methodGridStore.loadData(methods);

                    // <debug>
                    // debugger;
                    // </debug>

                    // bindings tab
                    // Ext.each(result.bindings, function(binding) {
                    //     bindings.push(Ext.create('AI.model.components.Detail', binding));
                    // });
                    //
                    // bindingsGridStore.loadData(bindings);
                }
            }
        );

        parent.getViewModel().set('componentstree.selected', true);

        AI.util.InspectedWindow.eval(
            AI.util.InspectedWindow.highlight,
            record.get('cmpId'),
            Ext.emptyFn
        );
    },

    /**
     *
     */
    onDeselectComponent: function(selModel) {
        var parent = selModel.view.up('components'),
            propsGrid = parent.down('properties'),
            methodGrid = parent.down('methods'),
            propsGridStore = propsGrid.getStore(),
            methodGridStore = methodGrid.getStore();

        parent.getViewModel().set('componentstree.selected', false);

        propsGridStore.removeAll();
        methodGridStore.removeAll();
    }
});
