/**
 * @class   AI.store.stores.Stores
 * @extends Ext.data.Store
 */
Ext.define('AI.store.stores.Stores', {
    extend : 'Ext.data.Store',

    requires : [
        'AI.model.stores.Store'
    ],

    constructor : function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model   : 'AI.model.stores.Store',
            storeId : 'Stores'
        }, cfg)]);
    }
});
