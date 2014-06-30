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
                        value: key + '()',
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

            // for components with Ext.mixin.Bindable (Ext JS 5)
            if (Ext.getVersion().major >= 5 && cmp.mixins && cmp.mixins.bindable) {
                data.mvvm = Object.create(null); //which sets __proto__ to undefined

                var viewController = cmp.getController(),
                    viewModel = cmp.getViewModel(),
                    bindings = cmp.getBind(),
                    boundData, boundItem, ownerData, boundPath, value;

                if (bindings) {
                    data.mvvm.bindings = [];

                    var recursiveFetchBindChain = function(item) {
                        var parent = (item && item.parent) ? item.parent : null,
                            chain = '';

                        if (parent && parent.name) {
                            chain = recursiveFetchBindChain(parent) + '.';
                        }

                        return chain + (item.name || '');

                    };

                    for (key in bindings) {
                        boundItem = bindings[key];

                        if (boundItem) {
                            ownerData = boundItem.owner.getData();
                            boundPath = recursiveFetchBindChain(boundItem.stub);
                            value = boundItem.getValue();

                            data.mvvm.bindings.push({
                                key: key,
                                boundTo: boundPath,
                                // check for object type - else it will crash for complex objects like Ext JS classes
                                // we use the $className (e.g. Ext.data.Store) if it's an Ext JS class
                                value: (Ext.isObject(value) ? (value.$className || '[object]') : value),
                                // check via hasOwnProperty()
                                // else e.g. a 'false' value won't be noticed as valid
                                isValid: ownerData.hasOwnProperty(boundPath),
                                type: (typeof value)
                            });
                        }
                    }
                }

                if (viewModel) {
                    boundData = viewModel.getData();

                    var recursiveFetchData = function(item, name) {
                        var node = Object.create(null), //which sets __proto__ to undefined
                            text = name || 'data',
                            children = [],
                            key;

                        // FIXME - recursion runs into an infinit loop crashing the devtools
                        return node;

                        // TODO: do we need to worry about other special types? Stores, etc...
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

                /*
                if (viewController) {
                    data.mvvm.controller = Object.create(null); //which sets __proto__ to undefined
                    data.mvvm.controller.functions = [];

                    for (key in viewController) {
                        if (typeof viewController[key] === 'function') {
                            data.mvvm.controller.functions.push({
                                text: key,
                                leaf: true
                            });
                        }
                    }

                    data.mvvm.controller.className = viewController.$className;
                    data.mvvm.controller.id = viewController.getId();
                }
*/
            }



            //Build the D3JS Dependency Graph data  ::


            // Reusable Fn to gather mixin data
            var getMixinData = function(mixinObj) {
                var returnArray = [],
                    keys        = Object.keys(mixinObj),
                    superclass,
                    clsMixins,
                    superclassData,
                    mixins,
                    hasDefinedMixins,  // Mixins that are NOT inherited
                    mixin;

                Ext.each(keys, function(mixinName) {
                    mixin = mixinObj[mixinName];

                    superclass = mixin.superclass;
                    clsMixins  = mixin.mixins;

                    // No inherited mixins
                    hasDefinedMixins = (superclass && clsMixins && (clsMixins !== superclass.mixins));

                    superclassData = superclass       ? getSuperClasses(superclass, 1) : [];
                    mixins         = hasDefinedMixins ? getMixinData(clsMixins)        : [];

                    returnArray.push({
                        type     : 'mixin',
                        name     : mixin.$className,
                        children : superclassData.concat(mixins)
                    });
                });

                return returnArray;
            };

            // Resuable Fn to get superclass data
            var getSuperClasses = function(cls, isSuperclass) {
                var supers = [],
                    superclass,
                    clsMixins,
                    superclassData,
                    mixins,
                    hasDefinedMixins; // Mixins that are NOT inherited

                if (cls)  {
                    superclass = cls.superclass;
                    clsMixins = cls.mixins;

                    // No inherited mixins
                    hasDefinedMixins = (superclass && clsMixins && (clsMixins !== superclass.mixins));

                    superclassData = superclass       ? getSuperClasses(superclass, 1) : [];
                    mixins         = hasDefinedMixins ? getMixinData(clsMixins)        : [];

                    supers.push({
                        name     : cls.$className,
                        type     : isSuperclass ? 'superclass' : '',
                        children : superclassData.concat(mixins)
                    });
                }

                return supers;
            };


            data.inheritance = getSuperClasses(cmp)[0];
            data.inheritance.type = 'cls';

        }

        return data;
    }
});
