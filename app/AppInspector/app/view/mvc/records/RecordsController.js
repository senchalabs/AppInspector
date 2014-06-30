/**
 *
 */
Ext.define('AI.view.mvc.records.RecordsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mvcrecords',

    /**
     *
     */
    onRecordSelect : function (selModel, record) {
        var panel = this.getView(),
            property = panel.down('propertygrid');

        property.setSource(Ext.JSON.decode(record.data.modelData));
    }
});
