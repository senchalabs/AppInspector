/**
 * Utility class containing methods which run in the context of the inspectedWindow
 */
Ext.define('AI.util.Component', {
    singleton : true,

    loadComponentTree : function () {
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
    }
});