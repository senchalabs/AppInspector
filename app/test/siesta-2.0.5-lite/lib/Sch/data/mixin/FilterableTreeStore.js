/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define("Sch.data.mixin.FilterableTreeStore", {
    
    requires : [
        'Sch.data.FilterableNodeStore'
    ],
    
    
    nodeStoreClassName      : 'Sch.data.FilterableNodeStore',
    
    nodeStore               : null,
    
    isFilteredFlag          : false,
    
    
    /**
     * Should be called in the constructor of the consuming class, to activate the filteirng functionality.
     */
    initTreeFiltering : function () {
        if (!this.nodeStore) this.nodeStore = this.createNodeStore(this);
        
        this.addEvents(
            'filter-set',
            'filter-clear',
            'nodestore-datachange-start',
            'nodestore-datachange-end'
        );
    },
    
    
    createNodeStore : function (treeStore) {
        return Ext.create(this.nodeStoreClassName, {
            treeStore       : treeStore,
            recursive       : true,
            rootVisible     : this.rootVisible
        });
    },
    
    
    /**
     * Clears current filter (if any).
     * 
     * See also {@link Sch.data.mixin.FilterableTreeStore} for additional information.
     */
    clearTreeFilter : function () {
        if (!this.isTreeFiltered()) return;
        
        this.refreshNodeStoreContent();
        
        this.isFilteredFlag = false;
        
        this.fireEvent('filter-clear', this);
    },
    
    
    refreshNodeStoreContent : function (skipUIRefresh) {
        var root            = this.getRootNode(),
            linearNodes     = [];
            
        var rootVisible     = this.rootVisible;
        
        var collectNodes    = function (node) {
            if (node.isHidden && node.isHidden() || node.hidden || node.data.hidden) return;
            
            if (rootVisible || node != root) linearNodes[ linearNodes.length ] = node;
            
            if (!node.data.leaf && node.isExpanded()) {
                var childNodes  = node.childNodes,
                    length      = childNodes.length;
                
                for (var k = 0; k < length; k++) collectNodes(childNodes[ k ]);
            }
        };
        
        collectNodes(root);
        
        this.fireEvent('nodestore-datachange-start', this);
        
        var nodeStore       = this.nodeStore;
        
        // "loadDataInNodeStore" is a special hook for buffered case
        // in buffered case, instead of "loadRecords" we need to use "cachePage"
        if (!this.loadDataInNodeStore || !this.loadDataInNodeStore(linearNodes)) nodeStore.loadRecords(linearNodes);
        
        // HACK - forcing view to refresh, the usual "refresh" event is blocked by the tree view (see `blockRefresh` property)
        if (!skipUIRefresh) this.fireEvent('forcedrefresh', this);
        
        this.fireEvent('nodestore-datachange-end', this);
    },
    
    
    /**
     * Returns the boolean, indicating whether this store is currently filtered
     * 
     * @return {Boolean}
     */
    isTreeFiltered : function () {
        return this.isFilteredFlag;
    },    
    
    
    /**
     * This method filters the tree store. It accept an object with following properties:
     * 
     * - `filter` - a function to check if the node should be included in the results. It will be called for each **leaf** node in tree and will receive the current node as the first argument.
     * It should return `true` if node should remain visible, `false` otherwise. The results will also contain all parents nodes of all matching leafs. Results will not include
     * parent nodes, which do not have at least one matching child.
     * To call this method for parent nodes too, pass an additional parameter - `checkParents` (see below).
     * - `scope` - a scope to call the filter with (optional)
     * - `checkParents` - when set to `true` will also call the `filter` function for each parent node. If function returns `false` for some parent node, 
     * it still may be included in filter results, if some of its children matches the `filter` (see also "shallow" option below). If function returns `true` for some parent node, it will be
     * included in the filtering results even if it does not have any matching child nodes. 
     * - `shallow` - implies `checkParents`. When set to `true` will stop checking child nodes if the `filter` function return `false` for some parent node. Whole sub-tree, starting
     * from non-matching parent, will be excluded from filtering results in such case.
     * - `onlyParents` - alternative for `checkParents`. When set to `true` will only call the provided `filter` function for parent tasks. If 
     * filter returns `true`, parent, and all its direct children leaf will be included in the results. If `filter` returns `false`, parent node still can
     * be included in the results (w/o direct children leafs), if some of its child nodes matches the filter.
     * - `fullMathchingParents` - implies `onlyParents`. In this mode, if parent node matches the filter, then not only its direct children
     * will be included in the results, but a whole sub-tree, starting form matching node.
     * 
     * Repeated calls to this method will clear previous filters.
     * 
     * This function can be also called with 2 arguments, which should be the `filter` function and `scope` in such case.
     * 
     * See also {@link Sch.data.mixin.FilterableTreeStore} for additional information.
     * 
     * @param {Object} params
     */
    filterTreeBy : function (params, scope) {
        var filter;
        
        if (arguments.length == 1 && Ext.isObject(arguments[ 0 ])) {
            scope       = params.scope;
            filter      = params.filter;
        } else {
            filter      = params;
            params      = {};
        }
        
        this.fireEvent('nodestore-datachange-start', this);
        
        params                  = params || {};
        
        var shallowScan             = params.shallow;
        var checkParents            = params.checkParents || shallowScan;
        var fullMathchingParents    = params.fullMathchingParents;
        var onlyParents             = params.onlyParents || fullMathchingParents;
        var rootVisible             = this.rootVisible;
        
        if (onlyParents && checkParents) throw new Error("Can't combine `onlyParents` and `checkParents` options");
        
        var keepTheseParents    = {};
        
        var root                = this.getRootNode(),
            linearNodes         = [];
        
        var includeParentNodesInResults = function (node) {
            var parent  = node.parentNode;
            
            while (parent && !keepTheseParents[ parent.internalId ]) {
                keepTheseParents[ parent.internalId ] = true;
                
                parent = parent.parentNode;
            }
        };
        
        var collectNodes    = function (node) {
            if (node.isHidden && node.isHidden() || node.hidden || node.data.hidden) return;
            
            var nodeMatches, childNodes, length, k;
            
            // `collectNodes` should not be called for leafs at all
            if (node.data.leaf) {
                if (filter.call(scope, node, keepTheseParents)) {
                    linearNodes[ linearNodes.length ] = node;
                    
                    includeParentNodesInResults(node);
                }
            } else {
                // include _all_ parent nodes in intermediate result set originally, except the root one
                // intermediate result set will be filtered
                if (rootVisible || node != root) linearNodes[ linearNodes.length ] = node;
                
                if (onlyParents) {
                    nodeMatches     = filter.call(scope, node);

                    childNodes      = node.childNodes;
                    length          = childNodes.length;
                        
                    if (nodeMatches) {
                        keepTheseParents[ node.internalId ] = true;
                        
                        includeParentNodesInResults(node);
                        
                        if (fullMathchingParents) {
                            node.cascadeBy(function (currentNode) {
                                if (currentNode != node) {
                                    linearNodes[ linearNodes.length ] = currentNode;
                                    
                                    if (!currentNode.data.leaf) keepTheseParents[ currentNode.internalId ] = true;
                                }
                            });
                            
                            return;
                        }
                    }
                    
                    // at this point nodeMatches and fullMathchingParents can't be both true
                    for (k = 0; k < length; k++)
                        if (nodeMatches && childNodes[ k ].data.leaf) 
                            linearNodes[ linearNodes.length ] = childNodes[ k ];
                        else if (!childNodes[ k ].data.leaf)
                            collectNodes(childNodes[ k ]);
                        
                } else {
                    // mark matching nodes to be kept in results
                    if (checkParents) {
                        nodeMatches = filter.call(scope, node, keepTheseParents);
                        
                        if (nodeMatches) {
                            keepTheseParents[ node.internalId ] = true;
                            
                            includeParentNodesInResults(node);
                        }
                    }
                    
                    // recurse if
                    // - we don't check parents
                    // - shallow scan is not enabled
                    // - shallow scan is enabled and parent node matches the filter or it does not, but its and invisible root, so we don't care
                    if (!checkParents || !shallowScan || shallowScan && (nodeMatches || node == root && !rootVisible)) {
                        childNodes      = node.childNodes;
                        length          = childNodes.length;
                        
                        for (k = 0; k < length; k++) collectNodes(childNodes[ k ]);
                    }
                }
            }
        };
        
        collectNodes(root);
        
        // additional filtering of the result set
        // removes the parent nodes which do not match filter themselves and have no macthing children  
        var nodesToKeep = [];
            
        for (var i = 0, len = linearNodes.length; i < len; i++) {
            var node    = linearNodes[ i ];
            
            if (node.data.leaf || keepTheseParents[ node.internalId ]) nodesToKeep[ nodesToKeep.length ] = node;
        }
        
        var nodeStore   = this.nodeStore;
        
        nodeStore.loadRecords(nodesToKeep, false);
        
        // HACK - forcing view to refresh, the usual "refresh" event is blocked by the tree view (see `blockRefresh` property)
        this.fireEvent('forcedrefresh', this);
        
        this.isFilteredFlag = true;
        
        this.fireEvent('nodestore-datachange-end', this);
        
        this.fireEvent('filter-set', this);
    },
    
    
    /**
     * Hide nodes from the tree store rendering presenation (they still remains in the store).
     * 
     * See also {@link Sch.data.mixin.FilterableTreeStore} for additional information.
     * 
     * @param {Function} filter - A filtering function. Will be called for each node in the tree store and receive a current node as 1st argument. Should return `true` to **hide** the node
     * and `false`, to **keep it visible**.
     * @param {Object} scope (optional).
     */
    hideNodesBy : function (filter, scope) {
        if (this.isFiltered()) throw new Error("Can't hide nodes of the filtered tree store");
        
        var me      = this;
        scope       = scope || this;
        
        this.getRootNode().cascadeBy(function (node) {
            node.hidden = filter.call(scope, node, me);
        });
        
        this.refreshNodeStoreContent();
    },
    
    
    /**
     * Shows all nodes, previously hidden with {@link #hideNodesBy}
     * 
     * See also {@link Sch.data.mixin.FilterableTreeStore} for additional information.
     */
    showAllNodes : function () {
        this.getRootNode().cascadeBy(function (node) {
            node.hidden = node.data.hidden = false;
        });
        
        this.refreshNodeStoreContent();
    }
});