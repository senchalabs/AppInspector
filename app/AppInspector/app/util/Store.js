/**
 * @class   AI.util.Store
 * @singleton
 *
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
            var model = store.model || store.getModel(), // Ext || Touch
                isTree = !! store.root || !! store.tree;

            stores.push({
                id: store.storeId || store.getStoreId(), // Ext || Touch
                count: (isTree ? 'TreeStore' : store.getCount()),
                model: model ? model.$className : null, // no (explicit) model with Ext5
                isTree: isTree
            });
        });

        return stores;
    },

    /**
     * @param {String} storeId
     * @returns {Array}
     */
    getRecords: function(storeId, start) {
        var records = [],
            store = Ext.getStore(storeId),
            range;

        start = start || 0;

        if (!store) {
            return records;
        }

        range = store.getRange(start, start + 49); // 50 record page size

        Ext.Array.each(range, function(record) {
            records.push({
                id: record.id || record.get('id'),
                modelData: Ext.JSON.encode(record.data),
                rawData: Ext.JSON.encode(record.raw) // TODO: "raw" doesn't exist in Ext 5!
            });
        });

        return {
            records: records,
            totalCount: store.getCount()
        };
    }
});
