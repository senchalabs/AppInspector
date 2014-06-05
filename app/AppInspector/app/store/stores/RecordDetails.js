/**
 * @class   AI.store.stores.RecordDetails
 * @extends Ext.data.TreeStore
 */
Ext.define('AI.store.stores.RecordDetails', {
    extend : 'Ext.data.TreeStore',
    alias  : 'store.recorddetails',

    requires : [
        'AI.model.stores.RecordDetail',
        'Ext.Date'
    ],

    constructor : function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model           : 'AI.model.stores.RecordDetail',
            storeId         : 'RecordDetails',
            defaultRootText : '',
            root            : {
                text       : 'Model',
                value      : '',
                cls        : 'root',
                iconCls    : 'no-icon',
                expanded   : true,
                expandable : false,
                children   : [

                ]
            }
        }, cfg)]);
    }
});
