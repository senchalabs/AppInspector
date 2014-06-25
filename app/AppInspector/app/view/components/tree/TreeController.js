/**
 *
 */
Ext.define('AI.view.components.tree.TreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.componentstree',

    requires: [
        'AI.model.components.Component',
        'AI.model.components.Detail',
        'AI.util.Component',
        'AI.util.InspectedWindow'
    ],

    mixins: [
        'AI.mixin.Localize'
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
        tree.setLoading('Loading components...');

        AI.util.InspectedWindow.eval(
            AI.util.Component.loadComponentTree,
            null,
            Ext.Function.bind(this.buildComponentsTree, this, [tree], true)
        );
    },

    /**
     *
     */
    buildComponentsTree: function(components, isException, tree, parent) {
        var store = this.getStore('Components'),
            root = parent || store.getRoot();

        if (tree && root) {
            root.removeAll();
        }

        Ext.each(components, function(cmp) {
            var children = cmp.children,
                node = root.appendChild({
                    text: cmp.text,
                    cmpId: cmp.cmpId,
                    itemId: cmp.itemId,
                    xtype: cmp.xtype,
                    leaf: !children,
                    children: children
                });

            // recursion...
            if (children.length > 0) {
                this.buildComponentsTree(children, null, null, node)
            }
        }, this);

        if (tree) {
            tree.setLoading(false);
            tree.fireEvent('cmpsloaded', tree);
        }
    },

    /**
     *
     */
    onRefreshClick: function(btn) {
        var me = this,
            tree = me.getView(),
            treeFilter = tree.down('filterfield'),
            treeStore = tree.getStore();

        treeStore.clearFilter();
        treeFilter.reset();

        me.onDeselectComponent();
        me.onComponentTreeActivate(tree);
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
        var me = this;

        AI.util.InspectedWindow.eval(
            AI.util.Component.getInspectedComponent,
            record.get('cmpId'),
            Ext.Function.bind(me.setComponentsDetails, me, [record], true)
        );

        AI.util.InspectedWindow.eval(
            AI.util.InspectedWindow.highlight,
            record.get('cmpId'),
            Ext.emptyFn
        );
    },

    setComponentsDetails: function(result, isException, record) {
        var me = this,
            tree = me.getView(),
            components = tree.up('components'),
            tabpanel = components.down('tabpanel'),
            properties, methods, bindings, vm, vc;

        if (isException || !result) {
            // tree.fireEvent('deselect', me);
            components.getViewModel().set('selection', false);
            return;
        }

        properties = result.properties || {};
        methods = result.methods || {};

        if (result.mvvm) {
            bindings = result.mvvm.bindings || {};
            vm = result.mvvm.viewModel || {};
            vc = result.mvvm.controller || {};
        }

        // set grid data
        me.setComponentsDetailsGrid(properties, tabpanel.down('properties'), record, components);
        me.setComponentsDetailsGrid(methods, tabpanel.down('methods'), record, components);
        me.setComponentsDetailsGrid(bindings, tabpanel.down('bindings'), record, components);

        // set tree data
        me.setComponentsDetailsTree(vm, tabpanel.down('viewmodeldata'), record, components);
        // me.setComponentsDetailsTree(vc, tabpanel.down('viewcontrollerdata'), record, components);

        components.getViewModel().set('selection', true);
    },

    /**
     * @param {Object}          details
     * @param {Ext.Component}   view
     * @param {Ext.data.Model}  record
     * @param {Ext.Component}   parent
     */
    setComponentsDetailsGrid: function(details, view, record, parent) {
        var me = this,
            parentVM = me.getViewModel().getParent(),
            store = view.getStore(),
            data = [];

        store.removeAll();

        if (Ext.Object.getSize(details) > 0) {
            Ext.each(details, function(property) {
                data.push(Ext.create('AI.model.components.Detail', property));
            });
        }

        store.loadData(data);

        // en-/disable
        parentVM.set('tabs.' + view.xtype, !! data.length);
    },

    /**
     * @param {Object}          data
     * @param {Ext.Component}   view
     * @param {Ext.data.Model}  record
     * @param {Ext.Component}   parent
     */
    setComponentsDetailsTree: function(data, view, record, parent) {
        var me = this,
            parentVM = me.getViewModel().getParent(),
            root = view.getRootNode(),
            store = view.getStore(),
            children = [];

        // reset
        root.removeAll();
        root.set({
            text: '',
            value: '',
            children: []
        });

        // <debug>
        console.groupCollapsed('setComponentsDetailsTree(', view.$className, ')');
        console.log('scope', me);
        console.log('view', view);
        console.log('root', root);
        console.log('store', store);
        console.log('arguments', arguments);
        console.log(data);
        console.groupEnd();
        // </debug>

        switch (view.xtype) {
            case 'viewmodeldata':
                if (data.text && data.children) {
                    root.set({
                        text: data.text,
                        value: data.value,
                        expanded: true,
                        expandable: false
                    });

                    // TODO - children
                }
                break;

            case 'viewcontrollerdata':
                // TODO
                break;
        }

        root.appendChild(children);

        // en-/disable
        parentVM.set('tabs.' + view.xtype, children.length > 0);
    },

    /**
     *
     */
    onDeselectComponent: function(selModel) {
        // TODO - reset details pan
        this.getViewModel().getParent().set('selection', false);
    }
});
