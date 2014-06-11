/**
 * @class   AI.util.Component
 * @singleton
 *
 * Utility class containing methods which run in the context of the inspectedWindow
 */
Ext.define('AI.util.Component', {
    singleton: true,

    /**
     * @returns {*}
     */
    loadComponentTree: function() {
        var getComponentTreeNodes = function(comps) {
            var compNodes = [];

            var getCompNodeForComp = function(comp) {
                return {
                    text: comp.id + (comp.itemId ? ' (' + comp.itemId + ')' : ''),
                    cmpId: comp.id || '',
                    itemId: comp.itemId || '',
                    xtype: comp.xtype,
                    children: []
                };
            };

            if (!comps) {
                return;
            }

            if (!Ext.isArray(comps)) {
                comps = [comps];
            }

            Ext.each(comps, function(comp) {
                var node = getCompNodeForComp(comp),
                    items = {
                        text: 'items',
                        children: []
                    },
                    dockedItems = {
                        text: 'dockedItems',
                        children: []
                    },
                    children;

                if (comp.items && comp.items.items && comp.items.items.length) {
                    children = getComponentTreeNodes(comp.items.items); //recursion...

                    Ext.each(children, function(child) {
                        items.children.push(child);
                    });

                    node.children.push(items);
                }

                if (comp.dockedItems && comp.dockedItems.items && comp.dockedItems.items.length) {
                    children = getComponentTreeNodes(comp.dockedItems.items); //recursion...

                    Ext.each(children, function(child) {
                        dockedItems.children.push(child);
                    });

                    node.children.push(dockedItems);
                }

                compNodes.push(node);
            });

            return compNodes;
        };

        //GET TOP LEVEL COMPONENTS FIRST
        var top = [],
            all, nodes;

        // Ext JS 5 breaks the older ComponentManager API
        if (Ext.versions.extjs && Ext.versions.extjs.major > 4) {
            all = Ext.ComponentManager.getAll();
        } else {
            all = Ext.ComponentManager.all.getArray();
        }

        Ext.each(all, function(comp) {
            if (!comp.ownerCt && !comp.parent) {
                top.push(comp);
            }
        });

        nodes = getComponentTreeNodes(top);

        return nodes;
    },

    /**
     * @returns {Object/undefined}
     */
    getInspectedComponent: function(id) {
        var cmp, key, data, parent,
            isChanged, isOwn;

        cmp = Ext.getCmp(id);

        if (cmp) {
            parent = cmp.superclass;

            data = Object.create(null); //which sets __proto__ to undefined

            data.properties = [];
            data.methods = [];

            for (key in cmp) {
                isOwn = (!parent.hasOwnProperty(key) && cmp[key] !== parent[key]);
                isChanged = (parent.hasOwnProperty(key) && cmp[key] !== parent[key]);

                if (typeof cmp[key] === 'function') {
                    data.methods.push({
                        name: key,
                        value: 'METHOD',
                        isOwn: isOwn,
                        isOverride: isChanged
                    });
                } else if (typeof cmp[key] !== 'object') {
                    data.properties.push({
                        name: key,
                        value: cmp[key],
                        isChanged: (isChanged || isOwn),
                        isOwn: isOwn
                    });
                }
            }

            data.properties.push({
                name: '$parent',
                value: parent.$className
            });

            //for components with Ext.mixin.Bindable (Ext JS 5)
            if (Ext.getVersion().major >= 5 && cmp.mixins && cmp.mixins.bindable) {
                data.mvvm = Object.create(null); //which sets __proto__ to undefined

                var viewController = cmp.getController(),
                    viewModel = cmp.getViewModel(),
                    bindings = cmp.getBind(),
                    boundData, boundItem, ownerData, boundPath, value;

                if (bindings) {
                    data.mvvm.bindings = [];

                    var recursiveFetchBindChain = function(item) {
                        var parent = item.parent,
                            chain = '';

                        if (parent && parent.name) {
                            chain = recursiveFetchBindChain(parent) + '.';
                        }

                        return chain + item.name;

                    };

                    for (key in bindings) {
                        boundItem = bindings[key];
                        ownerData = boundItem.owner.getData();
                        boundPath = recursiveFetchBindChain(boundItem.stub);

                        data.mvvm.bindings.push({
                            key: key,
                            value: boundItem.getValue(),
                            boundTo: boundPath,

                            isValid: (boundItem.getValue()) ? true : eval('ownerData.' + boundPath) ? true : false
                        });
                    }
                }

                if (viewModel) {
                    boundData = viewModel.getData();

                    var recursiveFetchData = function(item, name) {
                        var node = Object.create(null), //which sets __proto__ to undefined
                            text = name || 'data',
                            children = [],
                            key;

                        //TODO: do we need to worry about other special types? Stores, etc...
                        if (item.isModel) {
                            return recursiveFetchData(item.data, item.$className);
                        }

                        for (key in item) {
                            value = item[key];

                            if (Ext.isObject(value)) {
                                children.push(recursiveFetchData(value, key));
                            } else {
                                children.push({
                                    text: key,
                                    value: value,
                                    leaf: true
                                });
                            }
                        }

                        node.text = text;
                        node.children = children;

                        return node;
                    };

                    data.mvvm.viewModel = Object.create(null); //which sets __proto__ to undefined
                    data.mvvm.viewModel.text = viewModel.$className;
                    data.mvvm.viewModel.value = viewModel.getId();
                    data.mvvm.viewModel.children = recursiveFetchData(boundData);
                }

                if (viewController) {
                    data.mvvm.controller = Object.create(null); //which sets __proto__ to undefined

                    data.mvvm.controller.className = viewController.$className;
                    data.mvvm.controller.id = viewController.getId();
                }
            }
        }

        return data;
    }
});
