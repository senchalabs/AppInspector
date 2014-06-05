/**
 * @class   AI.store.BoxLayouts
 * @extends Ext.data.Store
 */
Ext.define('AI.store.BoxLayouts', {
    extend : 'Ext.data.Store',

    requires : [
        'AI.model.Overnested'
    ],

    constructor : function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model   : 'AI.model.Overnested',
            storeId : 'BoxLayouts'
        }, cfg)]);
    }
});
