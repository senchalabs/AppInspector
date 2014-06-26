/**
 *
 */
Ext.define('AI.view.stores.details.RecordDetailsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.recorddetails',

    /**
     *
     */
    showDetails: function(grid, record) {
        var store = grid.getStore(),
            data = record.getData(),
            details = Ext.JSON.decode(data.rawData || data.modelData);

        store.removeAll();

        Ext.Object.each(details, function(key, value) {
            store.add({
                text: key,
                value: value,
                type: (typeof value)
            });
        });
    }
});
