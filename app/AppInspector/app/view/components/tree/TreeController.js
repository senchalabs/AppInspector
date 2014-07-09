/**
 * @class   AI.view.components.tree.TreeController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.components.tree.TreeController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.componentstree',

    requires: [
        'AI.model.Base',
        'AI.util.Component',
        'AI.util.InspectedWindow'
    ],

    mixins: [
        'AI.mixin.Localize'
    ],

    /**
     * @param {AI.view.components.tree.TreeController}  tree
     */
    onActivate: function (tree) {
        // load the "Components" upfront ...
        var initialLoad = tree.getInitialLoad();

        if (!initialLoad && tree) {
            // ... but only once
            tree.setInitialLoad(true);

            this.onComponentTreeActivate(tree);
        }
        else {
            tree.fireEvent('cmpsloaded', tree);
        }
    },

    /**
     * @param {AI.view.components.tree.TreeController}  tree
     */
    onComponentTreeActivate: function (tree) {
        tree.setLoading('Loading components...');

        AI.util.InspectedWindow.eval(
            AI.util.Component.loadComponentTree,
            null,
            Ext.Function.bind(this.buildComponentsTree, this, [tree], true)
        );
    },

    /**
     *
     * @param {Object[]}                                components
     * @param {Boolean}                                 isException
     * @param {AI.view.components.tree.TreeController}  tree
     * @param {Ext.data.TreeModel}                      [parent]    for recursion only
     */
    buildComponentsTree: function (components, isException, tree, parent) {
        var store = this.getStore('Components'),
            root = parent || store.getRoot();

        if (tree && root) {
            root.removeAll();
        }

        Ext.each(components, function (cmp) {
            var children = cmp.children,
                len = children.length,
                node = root.appendChild({
                    text    : cmp.text,
                    cmpId   : cmp.cmpId,
                    itemId  : cmp.itemId,
                    xtype   : cmp.xtype,
                    leaf    : (!len),
                    children: (len ? children : null)
                });

            // recursion...
            if (children.length > 0) {
                this.buildComponentsTree(children, null, null, node);
            }
        }, this);

        if (tree) {
            tree.setLoading(false);
            tree.fireEvent('cmpsloaded', tree);
        }
    },

    /**
     * @param {Ext.button.Button}   [btn]
     */
    onRefreshClick: function (btn) {
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
     * @param {AI.view.field.Filter}    field
     * @param {String}                  value
     */
    onApplyFilter: function (field, value) {
        var tree = field.up('componentstree'),
            store = tree.getStore();

        store.clearFilter();

        if (value !== '') {
            store.filterBy(function (record, id) {
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
     * @param   {Ext.selection.Model/Object}    selModel
     * @param   {Ext.data.Model}                record
     */
    onSelectComponent: function (selModel, record) {
        var me = this,
            cmpId = record.get('cmpId');

        AI.util.InspectedWindow.eval(
            AI.util.Component.getInspectedComponent,
            cmpId,
            Ext.Function.bind(me.setComponentsDetails, me, [record], true)
        );

        AI.util.InspectedWindow.eval(
            AI.util.InspectedWindow.highlight,
            cmpId,
            Ext.emptyFn
        );
    },

    /**
     * @param {Object}          details
     * @param {Object[]}        details.properties
     * @param {Object[]}        details.methods
     * @param {Object}          details.mvvm
     * @param {Object[]}        details.mvvm.bindings
     * @param {Object[]}        details.mvvm.viewModel
     * @param {Object[]}        details.mvvm.viewController
     * @param {Object}          details.inheritance
     * @param {Boolean}         isException
     */
    setComponentsDetails: function (details, isException) {
        var me = this,
            tree = me.getView(),
            components = tree.up('components'),
            tabpanel = components.down('tabpanel'),
            properties, methods, bindings, vm, vc, inheritanceModel;

        if (isException || !details) {
            me.deselectComponent(tree, components, tabpanel);
            return;
        }

        tabpanel.setLoading('Loading details...');

        properties = details.properties || {};
        methods = details.methods || {};

        if (details.mvvm) {
            bindings = details.mvvm.bindings || {};
            vm = details.mvvm.viewModel || {};
            vc = details.mvvm.controller || {};
        }

        // set grid data
        me.setComponentsDetailsGrid(properties, tabpanel.down('properties'));
        me.setComponentsDetailsGrid(methods, tabpanel.down('methods'));
        me.setComponentsDetailsGrid(bindings, tabpanel.down('bindings'));

        // set tree data
        me.setComponentsDetailsTree(vm, tabpanel.down('viewmodeldata'));
        // me.setComponentsDetailsTree(vc, tabpanel.down('viewcontrollerdata'));

        // set the inheritance model
        if (details.inheritance) {
            inheritanceModel = tabpanel.down('inheritancemodel');

            inheritanceModel.enable();
            inheritanceModel.renderDiagram(details.inheritance);
        }

        tabpanel.enable();
        tabpanel.setLoading(false);
    },

    /**
     * @param {Object[]}        details
     * @param {Ext.Component}   view
     */
    setComponentsDetailsGrid: function (details, view) {
        var me = this,
            parentVM = me.getViewModel().getParent(),
            store = view.getStore(),
            data = [];

        store.removeAll();

        if (Ext.Object.getSize(details) > 0) {
            Ext.each(details, function (property) {
                data.push(Ext.create('AI.model.Base', property));
            });
        }

        store.loadData(data);

        // en-/disable
        parentVM.set('tabs.' + view.xtype, !!data.length);
    },

    /**
     * @param {Object[]}        details
     * @param {Object}          details.children
     * @param {Ext.Component}   view
     */
    setComponentsDetailsTree: function (details, view) {
        var me = this,
            parentVM = me.getViewModel().getParent(),
            isTreeNode = (details && details.children) ? true : false,
            children = isTreeNode ? details : [];

        view.getStore().setRootNode({
            expanded: true,
            children: children
        });

//        switch (view.xtype) {
//            case 'viewmodeldata':
//                // TODO
//                break;
//
//            case 'viewcontrollerdata':
//                // TODO
//                break;
//        }

        // en-/disable
        parentVM.set('tabs.' + view.xtype, isTreeNode);
    },

    /**
     * @param   {AI.view.components.tree.Tree}  tree
     * @param   {AI.view.components.Components} components
     * @param   {Ext.tab.Panel}                 tabpanel
     */
    deselectComponent: function (tree, components, tabpanel) {
        // TODO - clear details view, filter, etc.

        tabpanel.disable();
    }
});
