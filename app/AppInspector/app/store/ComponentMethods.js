/**
 * @class   AI.store.ComponentMethods
 * @extends Ext.data.Store
 */
Ext.define('AI.store.ComponentMethods', {
    extend : 'Ext.data.Store',

    requires : [
        'Ext.util.Sorter',
        'Ext.data.Field'
    ],

    constructor : function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId : 'ComponentMethods',
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
                    name         : 'isOverride',
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
