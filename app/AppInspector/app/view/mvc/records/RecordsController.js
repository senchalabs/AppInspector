/**
 * @class   AI.view.mvc.records.RecordsController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.mvc.records.RecordsController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.mvcrecords',

    /**
     * @param   {Ext.selection.Model}   selModel
     * @param   {Ext.data.Model}        record
     */
    onRecordSelect: function (selModel, record) {
        var panel = this.getView(),
            property = panel.down('propertygrid');

        property.setSource(Ext.JSON.decode(record.data.modelData));
    }
});
