/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.FilterableTreeView', {
    extend          : 'Ext.tree.View',
    alias           : 'widget.filterabletreeview',
    
    mixins          : [
        'Sch.mixin.FilterableTreeView'
    ],
    
    
    constructor     : function () {
        this.callParent(arguments)
        
        this.initTreeFiltering()
    },
    
    
    bindStore : function (store, initial, propName) {
        if (store instanceof Ext.data.TreeStore) {
            this.bindFilterableTreeStore(store)
            
            this.callParent([ store.nodeStore || store, initial, propName ])
        } else
            this.callParent(arguments)
    }
})
