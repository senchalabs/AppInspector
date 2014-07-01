/**
 * @class   AI.view.stores.recordslisttree.RecordsListTreeController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.stores.recordslisttree.RecordsListTreeController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.recordslisttree',

    requires: [
        'AI.util.TreeStore'
    ],

    /**
     * @param   {AI.view.stores.recordslisttree.RecordsListTree}    tree
     * @param   {Ext.data.TreeModel}                                record
     */
    loadTreeStoreRecords: function (tree, record) {
        var store = tree.getStore(),
            root = store.getRoot();

        AI.util.InspectedWindow.eval(
            AI.util.TreeStore.getChildNodes,
            [record.get('id')], // storeId
            function (result) {
                root.removeAll();

                root.appendChild(result);
                root.expandChildren();
            }
        );
    },

    /**
     * @param   {Ext.selection.Model}   selModel
     * @param   {Ext.data.TreeModel}    record
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
