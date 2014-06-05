/**
 * @class   AI.store.Stores
 * @extends Ext.data.Store
 */
Ext.define('AI.store.Stores', {
    extend : 'Ext.data.Store',

    requires : [
        'AI.model.Store'
    ],

    constructor : function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model   : 'AI.model.Store',
            storeId : 'Stores'
        }, cfg)]);
    }
});
