/**
 * @class   AI.view.stores.recordslist.RecordsListController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.stores.recordslist.RecordsListController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.recordslist',

    /**
     * @param  {AI.view.stores.details.RecordsList} grid
     * @param  {Ext.data.Model}                     record
     */
    loadStoreRecords: function (grid, record) {
        var store = grid.getStore();

        store.removeAll();

        store.getProxy().setInspectedStoreId(record.get('id'));

        store.loadPage(1, {
            callback: function () {
                // scope is the store
                record.set('count', this.getTotalCount());
            }
        });
    },

    /**
     * @param   {Ext.selection.Model}   selModel
     * @param   {Ext.data.Model}        record
     *
     * @fires   showdetails
     */
    onSelect: function (selModel, record) {
        var parent = this.getView().up('stores'),
            detail = parent.down('recorddetails');

        // delegate
        detail.fireEvent('showdetails', detail, record);
    }
});
