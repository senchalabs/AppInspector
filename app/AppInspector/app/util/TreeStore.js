/**
 * @class   AI.util.TreeStore
 * @singleton
 *
 * Utility class containing methods which run in the context of the inspectedWindow.
 */
Ext.define('AI.util.TreeStore', {
    singleton: true,

    /**
     * @param  {String} storeId
     */
    getChildNodes: function(storeId) {
        var store = Ext.getStore(storeId),
            root;

        if (!store) {
            return {};
        }

        // Ext JS 5 changed to {Ext.data.TreeModel}
        if (store.getRoot) {
            // <debug>
            console.log('TODO');
            // </debug>

            return store.getRoot().childNodes;
        } else {
            root = store.getRootNode();

            return root.serialize();
        }
    }
});
