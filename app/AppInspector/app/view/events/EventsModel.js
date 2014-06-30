/**
 *
 */
Ext.define('AI.view.events.EventsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.events',

    data: {
        recording: false
    },

    stores: {
        Events: {
            storeId: 'Events',
            fields: ['eventName', 'xtype', 'source', 'cmpId'],
            proxy: {
                type: 'memory'
            },
            findAll: function (property, value, anyMatch, caseSensitive) {
                var me = this,
                    data = Ext.clone(me.data),

                    filter = new Ext.util.Filter({
                        property: property,
                        value: value,
                        anyMatch: anyMatch,
                        caseSensitive: caseSensitive
                    }),

                    filteredData = data.createFiltered(filter),
                    indices = [];

                Ext.each(filteredData.getRange(), function (record) {
                    var index = me.indexOf(record);
                    indices.push(index);
                });

                return indices;
            }
        }
    }
});
