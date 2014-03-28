/**
 * Utility class containing methods which run in the context of the inspectedWindow
 */
Ext.define('AI.util.Store', {
    singleton : true,

    /**
     * @returns {Array}
     */
    getStores : function () {
        var stores = [];

        Ext.each(Ext.StoreManager.items, function (store) {
            stores.push({
                id    : store.storeId || store.getStoreId(), //Ext || Touch
                count : (store.root) ? 'TreeStore' : store.getCount(),
                leaf  : (store.root) ? false : true
            });
        });

        return stores;
    },

    /**
     * @param {String} storeId
     * @returns {Array}
     */
    getRecords : function (storeId, start) {
        var records = [],
            store = Ext.getStore(storeId),
            range;

        //we can't read TreeStore records the same way
        if (store.root) {
            return false;
        }

        range = store.getRange(start, start + 49); //50 record page size

        Ext.Array.each(range, function (record) {
            records.push({
                id        : record.id || record.get('id'),
                modelData : record.data,
                rawData   : record.raw //TODO: "raw" doesn't exist in Ext 5!
            });
        });

        return {
            records    : records,
            totalCount : store.getCount()
        };
    }
});
