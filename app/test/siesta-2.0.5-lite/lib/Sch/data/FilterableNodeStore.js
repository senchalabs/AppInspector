/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define("Sch.data.FilterableNodeStore", {
    extend          : 'Ext.data.NodeStore',
    
    
    onNodeExpand : function (parent, records, suppressEvent) {
        var visibleRecords      = [];
        
        for (var i = 0; i < records.length; i++) {
            var record      = records[ i ];
            
            if (!(record.isHidden && record.isHidden() || record.hidden || record.data.hidden)) visibleRecords[ visibleRecords.length ] = record;
        }
        
        return this.callParent([ parent, visibleRecords, suppressEvent ]);
    }
});