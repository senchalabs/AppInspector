/**
 *
 */
Ext.define('AI.view.stores.details.RecordsListTreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.recordslisttree',

    requires: [
        'AI.util.TreeStore'
    ],

    /**
     *
     */
    loadTreeStoreRecords: function(tree, record) {
        var store = tree.getStore(),
            root = store.getRoot();

        AI.util.InspectedWindow.eval(
            AI.util.TreeStore.getChildNodes,
            [record.get('id')], // storeId
            function(result) {
                root.removeAll();
debugger;
                root.appendChild(result);
                root.expandChildren();
            }
        );
    },

    /**
     *
     */
    onSelect: function(selModel, record, item, index, e, eOpts) {
        var parent = this.getView().up('stores'),
            detail = parent.down('recorddetails');

        // delegate
        detail.fireEvent('showdetails', detail, record);
    }
});
