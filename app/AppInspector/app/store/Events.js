Ext.define('AI.store.Events', {
    extend : 'Ext.data.Store',

    requires : [
        'AI.model.Event'
    ],

    config : {
        model   : 'AI.model.Event',
        storeId : 'Events'
    },

    findAll : function (property, value, anyMatch, caseSensitive) {
        var me = this,
            data = Ext.clone(me.data),

            filter = new Ext.util.Filter({
                property      : property,
                value         : value,
                anyMatch      : anyMatch,
                caseSensitive : caseSensitive
            }),

            filteredData = data.createFiltered(filter),
            indices = [];

        Ext.each(filteredData.getRange(), function (record) {
            var index = me.indexOf(record);
            indices.push(index);
        });

        return indices;
    }

});