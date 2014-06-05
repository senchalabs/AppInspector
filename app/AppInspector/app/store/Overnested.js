/**
 * @class   AI.store.Overnested
 * @extends Ext.data.Store
 */
Ext.define('AI.store.Overnested', {
    extend : 'Ext.data.Store',

    requires : [
        'AI.model.Overnested'
    ],

    constructor : function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model   : 'AI.model.Overnested',
            storeId : 'Overnested'
        }, cfg)]);
    }
});
