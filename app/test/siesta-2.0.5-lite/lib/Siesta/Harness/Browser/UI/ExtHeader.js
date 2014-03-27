/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.ExtHeader', {
    
    extend          : 'Siesta.Harness.Browser.UI.Header',
    
    versionField    : null,
    
    
    initComponent : function() {
        
        if (this.viewport.getOption('allowExtVersionChange')) {
            this.buttons = [
                {
                    xtype : 'label',
                    text  : 'Ext '
                },
                this.versionField = new Siesta.Harness.Browser.UI.VersionField({
                    // not so good line
                    value   : this.viewport.harness.findExtVersion(),
                    
                    listeners : {
                        change  : this.onVersionChange,
                        scope   : this
                    }
                })
            ];
        }
        
        this.callParent();
    },

    
    onVersionChange : function() {
        this.fireEvent('optionchange', this, 'extVersion', this.versionField.getValue());
    }
})
//eof Siesta.Harness.Browser.UI.ExtHeader
