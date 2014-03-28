/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI_Mobile.ResultList', {

    extend          : 'Ext.dataview.List',

    alias           : 'widget.resultlist',

    config : {
        itemTpl         : new Ext.XTemplate(
            '<div style="margin-left : {[this.getPadding(values)]}px" class="{[this.getRowClass(values)]}">',
                '{[ this.getDescription(values.result) ]} {[ this.getAnnotation(values) ]}', 
            '</div>', 
            {
                getDescription : function (result) {
                    if (result instanceof Siesta.Result.Summary)
                        return result.description.join('<br>')
                    else
                        return result.isWarning ? 'WARN: ' + result.description : result.description
                },
                
                
                getDepth : function (record) {
                    var depth       = 0
                    
                    while (record.parentNode) {
                        depth++
                        
                        record      = record.parentNode
                    }
                    
                    return depth
                },
                
                
                getAnnotation : function (data) {
                    var annotation = data.result.annotation
                    
                    if (annotation) {
                        return '<pre class="tr-assert-row-annontation">' + Ext.String.htmlEncode(annotation) + '</pre>'
                    } else
                        return '';
                },
                
                
                getPadding: function (data) {
                    return Math.max(data.depth - 1, 0) * 16
                },
                
                
                getRowClass: function (data) {
                    var result      = data.result
                    
                    var cls         = ''
                    
                    // TODO switch to "instanceof"
                    switch (result.meta.name) {
                        case 'Siesta.Result.Diagnostic': 
                            return 'tr-diagnostic-row ' + (result.isWarning ? 'tr-warning-row' : '');
                    
                        case 'Siesta.Result.Summary': 
                            return 'tr-summary-row ' + (result.isFailed ? ' tr-summary-failure' : '');
                    
                        case 'Siesta.Result.SubTest':
                            cls     = 'tr-subtest-row tr-subtest-row-' + data[ 'folderStatus' ]
                            
                            if (result.test.specType == 'describe') cls += ' tr-subtest-row-describe'
                            if (result.test.specType == 'it') cls += ' tr-subtest-row-it'
                        
                            return cls;
                        
                        case 'Siesta.Result.Assertion':
                            cls     += 'tr-assertion-row '
                        
                            if (result.isWaitFor) 
                                cls += 'tr-waiting-row ' + (result.completed ? (result.passed ? 'tr-waiting-row-passed' : 'tr-assertion-row-failed tr-waiting-row-failed') : '')
                            else if (result.isException) 
                                cls += result.isTodo ? 'tr-exception-todo-row' : 'tr-exception-row'
                            else if (result.isTodo)
                                cls += result.passed ? 'tr-todo-row-passed' : 'tr-todo-row-failed'
                            else
                                cls += result.passed ? 'tr-assertion-row-passed' : 'tr-assertion-row-failed'
                            
                            return cls
                        default:
                            throw "Unknown result class"
                    }
                }
            }
        ),
        cls             : 'result-list'
    },
    
    test            : null,
    
    
    prepareData: function (data, index, record) {
        data.RECORD     = record;
        
        return data
    },

    
    constructor : function() {
        this.callParent(arguments);
        
        this.setStore(new Ext.data.NodeStore({
            model       : 'Siesta.Harness.Browser.Model.Assertion',
            recursive   : true
        }))
    },

    
    getIFrame : function () {
        var test = this.test;

        if (test)
            return test.scopeProvider && test.scopeProvider.iframe || null
        else
            return null;
    },
    
    
    getIFrameWrapper : function () {
        var test = this.test;

        if (test)
            return test.scopeProvider && test.scopeProvider.wrapper || null
        else
            return null;
    },

    
    alignIFrame : function () {
        var iframe          = this.getIFrameWrapper();
        
        iframe && Ext.fly(iframe).addCls('active')
        
        var test    = this.test
        
        test && test.fireEvent('testframeshow')
    },

    
    hideIFrame : function () {
        var iframe          = this.getIFrameWrapper()
    
        iframe && Ext.fly(iframe).removeCls('active');
        
        var test    = this.test
        
        test && test.fireEvent('testframehide')
    },

    
    toggleFrameVisible : function() {
        var iframe          = this.getIFrame()
        
        iframe && Ext.fly(iframe).toggleCls('active');
    },

    
    isFrameVisible : function () {
        var iframe          = this.getIFrame()
        
        return iframe && Ext.fly(iframe).hasCls('active') || false;
    },

    
    showTest : function (test, assertionsStore) {
        if (this.test !== test) {
            this.hideIFrame();
            this.test   = test;
            
            this.getStore().setNode(assertionsStore.getNode());
        }
    }
});