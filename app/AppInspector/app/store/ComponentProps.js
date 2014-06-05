/**
 * @class   AI.store.ComponentProps
 * @extends Ext.data.Store
 */
Ext.define('AI.store.ComponentProps', {
    extend : 'Ext.data.Store',

    requires : [
        'Ext.util.Sorter',
        'Ext.data.Field'
    ],

    constructor : function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId : 'ComponentProps',
            sorters : {
                property : 'name'
            },
            fields  : [
                {
                    name : 'name',
                    type : 'string'
                },
                {
                    name : 'value',
                    type : 'auto'
                },
                {
                    defaultValue : null,
                    name         : 'isChanged',
                    type         : 'boolean',
                    useNull      : true
                },
                {
                    defaultValue : null,
                    name         : 'isOwn',
                    type         : 'boolean',
                    useNull      : true
                }
            ]
        }, cfg)]);
    }
});
