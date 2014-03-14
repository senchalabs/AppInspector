/**
 * Utility class containing methods which run in the context of the inspectedWindow
 */
Ext.define('AI.util.Store', {
    singleton: true,

    /**
     * @returns {Array}
     */
    getStores: function() {
        var stores = [];

        Ext.each(Ext.StoreManager.items, function(store) {
            stores.push({
                id: store.storeId || store.getStoreId(), //Ext || Touch
                count: (store.root) ? 'TreeStore' : store.getCount(),
                leaf: (store.root) ? false : true
            });
        });

        return stores;
    },

    /**
     * @param {String} storeId
     * @returns {Array}
     */
    getRecords: function(storeId) {
        var records = [],
            store = Ext.getStore(storeId);

        //we can't read TreeStore records the same way
        if (store.root) {
            return false;
        }

        store.each(function(record) {
            records.push({
                id: record.id || record.get('id'),
                modelData: record.data,
                rawData: record.raw
            });
        });

        return records;
    }
});
