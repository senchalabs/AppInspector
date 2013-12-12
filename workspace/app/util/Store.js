/**
 * Utility class containing methods which run in the context of the inspectedWindow
 */
Ext.define('AI.util.Store', {
    singleton : true,

    getStores : function () {
        var stores = [];

        Ext.each(Ext.StoreManager.items, function (store) {
            stores.push({
                id    : store.storeId,
                count : store.getCount()
            });
        });

        return stores;
    },

    getRecords : function (storeId) {
        var records = [],
            store = Ext.getStore(storeId);

        store.each(function (record) {
            records.push({
                id        : record.get('id'),
                modelData : record.data,
                rawData   : record.raw
            });
        });

        return records;
    }
});
