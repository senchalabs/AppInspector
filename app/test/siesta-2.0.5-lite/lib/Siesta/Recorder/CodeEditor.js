/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Recorder.CodeEditor', {
    extend : 'Ext.ux.form.field.CodeMirror',
    height : 100,
    cls    : 'siesta-recorder-codeeditor',

    listeners : {
        afterrender : function () {
            this.editor.focus();
        },
        delay       : 50
    },

//    isValid : function() {
//        var syntaxOk = true;
//        var val = this.getValue();
//
//        return syntaxOk && this.callParent(arguments);
//    },

    getErrors: function() {
        var value = this.getValue();

        if (value) {
            try{
                new Function(value)
            } catch(e) {
                return ["Invalid syntax"];
            }
        }

        return this.callParent(arguments);
    }
})