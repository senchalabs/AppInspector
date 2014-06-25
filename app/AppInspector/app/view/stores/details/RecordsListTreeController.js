/**
 *
 */
Ext.define('AI.view.stores.details.RecordsListTreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.recordslisttree',

    /**
     *
     */
    loadTreeStoreRecords: function(tree, record) {
        var store = Ext.getStore(record.get('id'));

        // TODO
        // debugger;
    }
});
