/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 * Target editor.
 */
Ext.define('Siesta.Recorder.TargetEditor', {
    extend : 'Ext.form.ComboBox',
    alias  : 'widget.targeteditor',

    enableKeyEvents : true,
    queryMode       : 'local',
    valueField      : 'value',
    displayField    : 'value',
    cls             : 'siesta-targeteditor',

    initComponent : function () {
        Ext.apply(this, {
            store : new Ext.data.Store({
                proxy  : 'memory',
                fields : ['type', 'value']
            })
        });

        this.callParent();
    },

    getValue : function() {
        var prot = Siesta.Recorder.RecordedEvent.prototype;
        var val = this.callParent(arguments);

        return (val && typeof val === 'string' && prot.parseOffset(val)) || val;
    },

    setValue : function(value) {
        // This method is called with an array of a single record
        if (value instanceof Array && value.length > 1) value = value.toString();

        this.callParent([value]);
    },

    populate : function (eventRecord) {
        var data = eventRecord.data;
        var storeData = [];

        ['domId', 'csq', 'cq', 'css', 'xy'].forEach(function (type) {
            if (data[type]) {
                storeData.push({ type : type, value : type === 'cq' ? '>>' + data[type] : data[type] });
            }
        });

        this.store.loadData(storeData);
    }

});
