/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.VersionField', {
    
    extend  : 'Ext.form.field.Spinner',
    alias   : 'widget.versionfield',

    width   : 90,
    
    // versions : read from harness?
    versions : [
        '4.0.2a',
        '4.0.7',
        '4.1.0',
        '4.1.1',
        '4.1.2',
        '4.1.3',
        '4.1.4'
    ],
    

    onSpinUp: function() {
        var me = this;
        var index = Ext.Array.indexOf(me.versions, me.getValue());
        if (index < me.versions.length - 1) {
            me.setValue(me.versions[index+1]);
        }
    },

    onSpinDown: function() {
        var val, me = this;
        var index = Ext.Array.indexOf(me.versions, me.getValue());
        if (index > 0) {
            me.setValue(me.versions[index-1]);
        }
    }
});
