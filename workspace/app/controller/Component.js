Ext.define('AI.controller.Component', {
    extend : 'Ext.app.Controller',

    requires : [
        'AI.store.Components',
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json',
        'AI.model.Component'
    ],

    init : function () {
        this.control({
            'ai-view-component-tree' : {
                'activate' : this.onComponentTreeActivate,
                'select'   : this.onSelectComponent
            },

            'button#RefreshComponentTree' : {
                click : this.onRefreshComponentsClick
            }
        });
    },

    onRefreshComponentsClick : function (btn) {
        var tree = btn.up('ai-view-component-tree');

        this.onComponentTreeActivate(tree);
    },

    onComponentTreeActivate : function (tree) {
        var nodes = [],
            root = tree.getRootNode();

        tree.setLoading('Loading components...');
        root.removeAll();

        chrome.devtools.inspectedWindow.eval(
            '(' + this.loadComponentTreeFromInspectedWindow + ')()',
            function (components, isException) {
                if (isException) {
                    AI.util.parseException(isException);
                    return;
                }

                Ext.each(components, function (cmp) {
                    var model = Ext.create('AI.model.Component', cmp);

                    nodes.push(model);
                });

                Ext.each(nodes, function (node) {
                    root.appendChild(node);
                });

                tree.setLoading(false);
            }
        );
    },

    loadComponentTreeFromInspectedWindow : function () {
        var getComponentTreeNodes = function (comps) {
            var compNodes = [];

            var getCompNodeForComp = function (comp) {
                return {
                    text     : comp.id + (comp.itemId ? ' (' + comp.itemId + ')' : ''),
                    cmpId    : comp.id || '',
                    itemId   : comp.itemId || '',
                    xtype    : comp.xtype,
                    children : []
                };
            };

            if (!comps) {
                return;
            }

            if (!Ext.isArray(comps)) {
                comps = [comps];
            }

            Ext.each(comps, function (comp) {
                var node = getCompNodeForComp(comp),
                    items = {
                        text     : 'items',
                        children : []
                    },
                    dockedItems = {
                        text     : 'dockedItems',
                        children : []
                    },
                    children;

                if (comp.items && comp.items.items && comp.items.items.length) {
                    children = getComponentTreeNodes(comp.items.items); //recursion...

                    Ext.each(children, function (child) {
                        items.children.push(child);
                    });

                    node.children.push(items);
                }

                if (comp.dockedItems && comp.dockedItems.items && comp.dockedItems.items.length) {
                    children = getComponentTreeNodes(comp.dockedItems.items); //recursion...

                    Ext.each(children, function (child) {
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
            all = Ext.ComponentManager.all.getArray(),
            nodes;

        Ext.each(all, function (comp) {
            if (!comp.ownerCt && !comp.parent) {
                top.push(comp);
            }
        });

        nodes = getComponentTreeNodes(top);

        return nodes;
    },

    onSelectComponent : function (selModel, record, index, eOpts) {
        AI.util.InspectedWindow.eval(
            AI.util.InspectedWindow.highlight,
            record.get('cmpId'),
            Ext.emptyFn
        );
    }
});