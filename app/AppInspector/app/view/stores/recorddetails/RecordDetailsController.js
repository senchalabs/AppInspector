/**
 *
 */
Ext.define('AI.view.stores.recorddetails.RecordDetailsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.recorddetails',

    /**
     *
     */
    showDetails: function (grid, record) {
        var store = grid.getStore(),
            data = record.getData(),
            details;

        store.removeAll();

        if (data.rawData || data.modelData) {
            details = Ext.JSON.decode(data.rawData || data.modelData);
        } else {
            details = data;
        }

        Ext.Object.each(details, function (key, value) {
            store.add({
                text: key,
                value: value,
                type: (typeof value)
            });
        });
    }
});
