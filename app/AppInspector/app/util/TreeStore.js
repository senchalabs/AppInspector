/**
 * @class   AI.util.TreeStore
 * @singleton
 *
 * Utility class containing methods which run in the context of the inspectedWindow.
 */
Ext.define('AI.util.TreeStore', {
    singleton : true,

    // <debug>
    // require: ['AI.mockup.TreeStore'],
    // </debug>

    /**
     * @param  {String} storeId
     */
    getChildNodes : function (storeId) {
        var store = Ext.getStore(storeId),
            root;

        if (!store) {
            return {};
        }

        // <debug>
        // store = Ext.create('AI.mockup.TreeStore', {});
        // </debug>

        // Ext JS 5 changed to {Ext.data.TreeModel}
        if (store.getRoot) {
            // TODO
            return {};
        }
        else {
            root = store.getRootNode();

            return root.serialize();
        }
    }
});
