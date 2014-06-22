/**
 *
 */
Ext.define('AI.view.stores.details.RecordsListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.recordslist',

    /**
     * @param  {AI.view.stores.details.RecordsList} grid
     * @param  {Ext.data.Model}                     record
     */
    loadStoreRecords: function(grid, record) {
        var store = grid.getStore();

        store.removeAll();

        store.getProxy().setInspectedStoreId(record.get('id'));

        store.loadPage(1, {
            callback: function(records, operation, success) {
                // scope is the store
                record.set('count', this.getTotalCount());
            }
        });
    },

    /**
     *
     */
    onSelect: function (selModel, record, item, index, e, eOpts) {
        var parent = this.getView().up('stores'),
            detail = parent.down('recorddetails');

        // delegate
        detail.fireEvent('showdetails', detail, record);
    }
});
