/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
// !XXX when adding new methods to this mixing need to also update the 
// `setupLockableTree` method in the Sch.mixin.Lockable
Ext.define("Sch.mixin.FilterableTreeView", {
    
    filterableTreeStore             : null,
    treeStoreFilteringListeners     : null,
    
    
    initTreeFiltering : function () {
        this.treeStoreFilteringListeners = {
            'nodestore-datachange-start'        : this.onFilterChangeStart,
            'nodestore-datachange-end'          : this.onFilterChangeEnd,
            
            'filter-clear'                      : this.onFilterCleared,
            'filter-set'                        : this.onFilterSet,
            'forcedrefresh'                     : this.onForcedRefresh,
            
            scope                               : this
        }
        
        var doInit  = function () {
            var treeStore       = this.up('tablepanel').store;

            this.bindFilterableTreeStore(treeStore)
        };
        
        if (this.rendered)
            doInit.call(this);
        else
            this.on('beforerender', doInit, this, { single : true });
    },
    
    
    bindFilterableTreeStore : function (store) {
        if (this.filterableTreeStore) this.mun(this.filterableTreeStore, this.treeStoreFilteringListeners)
        
        this.filterableTreeStore        = store
        
        if (store) this.mon(store, this.treeStoreFilteringListeners)
    },
    
    
    onForcedRefresh : function () {
        this.focusRow       = function () {}
        
        this.refresh()
        
        delete this.focusRow
    },
    
    
    onFilterChangeStart : function () {
        Ext.suspendLayouts();
    },
    
    
    onFilterChangeEnd : function () {
        Ext.resumeLayouts(true);
    },
    
    
    onFilterCleared : function () {
        delete this.toggle;
        
        var el          = this.getEl();
        
        if (el) el.removeCls('sch-tree-filtered');
    },
    
    
    onFilterSet : function () {
        this.toggle     = function () {};
        
        var el          = this.getEl();
        
        if (el) el.addCls('sch-tree-filtered');
    }
});