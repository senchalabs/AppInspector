/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI_Mobile.TestList', {

    alias       : 'widget.testlist',

    extend      : 'Ext.dataview.List',
    
    config : {
        displayField            : 'title',
        cls                     : 'tr-testgrid',
        
        disclosureProperty      : 'leaf',
        onItemDisclosure        : true,
        
        itemTpl         : new Ext.XTemplate(
            '<div style="margin-left : {[this.getPadding(values)]}px" class="{[this.getIconCls(values)]}">',
                '{title}',
            '</div>',
            '<tpl if="leaf">',
                '<div class="tr-test-results">',
                    '<div class="tr-test-results-passed">{passCount}</div><div class="tr-test-results-failed">{failCount}</div>',
                '</div>',
            '</tpl>',
            {
                getPadding: function (data) {
                    return Math.max(data.depth - 1, 0) * 25
                },
                
                getIconCls : function (data) {
                    var tdCls       = 'tr-test-status '
                    var testFile    = data.test
                
                    if (data['leaf']) {
                
                        var test = data['test']
                    
                        if (test) {
                        
                            if (data['isFailed'])
                                tdCls += 'tr-test-status-thrown'
                            
                            else if (data['isRunning'] && !test.isFinished())
                                tdCls += 'tr-test-status-running'
                            else
                                if (test.isFinished()) {
                                
                                    if (test.isPassed())
                                        tdCls += 'tr-test-status-passed'
                                    else 
                                        tdCls += 'tr-test-status-failed'
                                } else
                                    tdCls += 'tr-test-status-working'
                            
                        } else {
                        
                            if (data['isMissing'])
                                tdCls += 'tr-test-status-missing'
                            else
                                if (data['isStarting'])
                                    tdCls += 'tr-test-status-working'
                                else
                                    tdCls += 'tr-test-status-empty'
                        }
                    } else {
                        tdCls += 'tr-folder-' + data['folderStatus']
                    }
                    
                    return tdCls
                }
                // eof getIconCls
            }
            // eof helper functions
        )
        // eof template
    },

    
    getLabelCls : function (index, data, prev) {
        if (data.leaf) return prev
        
        return prev + ' tr-folder-item'
    }
})