/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI_Mobile.ResultSummaryButton', {

    alias       : 'widget.resultsummarybutton',

    extend      : 'Ext.Button',
    
    config : {
        cls         : 'result-summary-button'
    },

    constructor : function (config) {   
        this.callParent(arguments);
        this.passed = 0;
        this.failed = 0;
        this.summaryTpl = new Ext.XTemplate('<div class="passed-indicator">{passed}</div><div class="failed-indicator">{failed}</div>');
        this.resetSummary();
    },

    updateSummary : function(passed, failed) {
        this.passed += passed;
        this.failed += failed;

        this.setText(this.summaryTpl.apply({ passed : this.passed, failed : this.failed }));
    },

    resetSummary : function(passed, failed) {
        this.passed = 0;
        this.failed = 0;
        this.updateSummary(0,0);
    }
})
