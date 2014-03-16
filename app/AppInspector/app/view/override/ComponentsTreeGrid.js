/**
 * @class       AI.view.override.ComponentsTreeGrid
 * @override    AI.view.ComponentsTreeGrid
 *
 * Add {#filterTree} and {#clearFilters} methods to {@link AI.view.ComponentsTreeGrid}.
 *
 * Filtering is applied to {HTMLElement}s by CSS class instead of filtering the entire {@link Ext.data.TreeStore}.
 *
 * Thanks for the inspiration: https://gist.github.com/colinramsay/1789536
 */
Ext.define('AI.view.override.ComponentsTreeGrid', {
    override: 'AI.view.ComponentsTreeGrid',

    /**
     * @private
     * @type {Array}    _visibleNodeIds Array of {Ext.data.NodeInterface}.ids
     */
    _visibleNodeIds: [],

    /**
     * Recursivly apply filter to tree nodes.
     *
     * @param {String}  value
     *
     * @returns {Array}
     */
    filterTree: function(value) {
        var me = this,
            view = me.getView(),
            root = me.getRootNode();

        me.clearFilters();  // clear existing filters

        me.suspendLayouts();

        // preparation
        root.cascadeBy(function(tree, view, value) {
            var node = this,
                currentNode = node,
                ids = tree._visibleNodeIds,
                // fuzzy search
                re = new RegExp(value, 'i'),
                reText = re.test(node.get('text')),
                // reCmpId = re.test(node.get('cmpId')),
                // reItemId = re.test(node.get('itemId')),
                reXType = re.test(node.get('xtype'));

            node.expandChildren(true);

            // add IDs
            if (!Ext.Array.contains(ids, node.id) && (reText || reXType)) {
                while (currentNode.parentNode) {
                    ids.push(currentNode.id);

                    currentNode = currentNode.parentNode;
                }
            }
        }, null, [me, view, value]);

        // "apply" filter
        // @scope: {Ext.data.NodeInterface}
        root.cascadeBy(function(tree, view) {
            var node = this,
                ui = view.getNodeByRecord(node);

            if (ui && !Ext.Array.contains(tree._visibleNodeIds, node.id)) {
                // add the CSS class that defines what to do with filtered nodes
                Ext.fly(ui).addCls('filtered');
            }
        }, null, [me, view]);

        me.resumeLayouts();
    },

    /**
     * clearFilters
     */
    clearFilters: function() {
        var me = this,
            view = me.getView();

        me.suspendLayouts();

        // @scope: {Ext.data.NodeInterface}
        me.getRootNode().cascadeBy(function(tree, view) {
            var ui = view.getNodeByRecord(this);

            if (ui) {
                // remove the CSS class that defines what to do with filtered nodes
                // it's faster to use a CSS class than setting the display property directly on the DOM node
                Ext.fly(ui).removeCls('filtered');
            }

            if (!this.isRoot()) {
                me.collapseNode(this, true);
            }
        }, null, [me, view]);

        // reset the IDs array
        me._visibleNodeIds = [];

        me.resumeLayouts();
    }
});
