/**
 * @class       AI.view.override.ComponentsTreeGrid
 * @override    AI.view.ComponentsTreeGrid
 *
 * Add {#filterTree} and {#clearFilters} methods to {@link AI.view.ComponentsTreeGrid}.
 *
 * Filtering is applied to {HTMLElement}s by hiding/showing them instead of filtering the {@link Ext.data.TreeStore}.
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

        me.clearFilters();
        me.suspendLayouts();

        // preparation
        root.cascadeBy(function(tree, view, value) {
            var node = this,
                ids = tree._visibleNodeIds,
                // fuzzy search
                re = new RegExp(value, 'i'),
                reText = re.test(node.get('text')),
                reCmpId = re.test(node.get('cmpId')),
                reItemId = re.test(node.get('itemId')),
                reXType = re.test(node.get('xtype'));

            if (!node.isRoot() && (reText || reCmpId || reItemId || reXType)) {
                node.expandChildren(true);

                // add own nodeId - needed for applying the filter later
                if (!Ext.Array.contains(ids, node.id)) {
                    ids.push(node.id);
                }

                // also add the parentId if not already there
                if (!Ext.Array.contains(ids, node.parentId)) {
                    ids.push(node.parentId);
                }
            }
        }, null, [me, view, value]);

        // "apply" filter
        root.cascadeBy(function(tree, view) {
            var node = this,
                ui = view.getNodeByRecord(node),
                el = Ext.fly(ui);

            if (ui && !Ext.Array.contains(tree._visibleNodeIds, node.id)) {
                el.addCls('filtered'); // add the CSS class that defines what to do with filtered nodes
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

        me.getRootNode().cascadeBy(function(tree, view) {
            var ui = view.getNodeByRecord(this);

            if (ui) {
                Ext.fly(ui).removeCls('filtered'); // remove the CSS class that defines what to do with filtered nodes
            }
        }, null, [me, view]);

        me.collapseAll();
        me._visibleNodeIds = [];
    }
});
