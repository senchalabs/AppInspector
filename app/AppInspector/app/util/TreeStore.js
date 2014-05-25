/**
 * @class AI.util.TreeStore
 * Utility class containing methods which run in the context of the inspectedWindow.
 */
Ext.define('AI.util.TreeStore', {
    singleton: true,

    // <debug>
    // require: ['AI.mockup.TreeStore'],
    // </debug>

    /**
     * @param  {String} storeId
     */
    getChildNodes: function(storeId) {
        var store = Ext.getStore(storeId),
            root;

        if (!store) {
            return {};
        }

        // <debug>
        // store = Ext.create('AI.mockup.TreeStore', {});
        // </debug>

        root = store.getRootNode();

        return root.serialize();
    }
});
