/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
(function () {
    var config = {
        idProperty  : 'id',
        
        proxy       : { type : 'memory' },

        fields      : [
            'id',
            { name : 'folderStatus', defaultValue : 'yellow' },
            // the Siesta.Result instance itself
            { name : 'result' }
        ]
    };
    
    var isSenchaTouch = Ext.getVersion && Ext.getVersion('touch')

    Ext.define(
        'Siesta.Harness.Browser.Model.Assertion', 
        
        Ext.apply({
            extend : 'Ext.data.Model',
            
            getResult : function () {
                return this.data.result
            },
            
            
            isAssertion : function () {
                return this.data.result instanceof Siesta.Result.Assertion
            },
            
            
            isDiagnostic : function () {
                return this.data.result instanceof Siesta.Result.Diagnostic
            },
            
            
            isSummary : function () {
                return this.data.result instanceof Siesta.Result.Summary
            },
            
            
            ensureVisible : function () {
                var parent      = this.parentNode
                
                while (parent && !parent.isRoot()) {
                    parent.expand()
                    
                    parent      = parent.parentNode
                }
            },
            
            
            isWaitingAssertion : function () {
                var result      = this.data.result
                
                return this.isAssertion() && result.isWaiting && !result.completed
            },
            
            
            updateFolderStatus : function () {
                if (!this.isLeaf()) this.set('folderStatus', this.computeFolderStatus())
    
                var parentNode = this.parentNode
    
                if (parentNode && !parentNode.isRoot()) parentNode.updateFolderStatus()
            },
            
            
            triggerUIUpdate: function(){
                // This isn't ideal, however none of the underlying fields have changed
                // but we still need to update the UI
                this.afterEdit([]);    
            },

            
            computeFolderStatus : function () {
                if (!this.isLeaf() && this.getResult().isWorking()) return 'working'
                
                if (!this.childNodes.length) return 'yellow'
                
                var isWorking   = false
                var hasFailed   = false
                var allGreen    = true
    
                Joose.A.each(this.childNodes, function (childNode) {
                    var result  = childNode.getResult()
    
                    if (childNode.isLeaf()) {
                        if (childNode.isWaitingAssertion()) 
                            isWorking           = true
                        
                        if (childNode.isAssertion()) {
                            if (!result.isPassed()) {
                                allGreen        = false
                                hasFailed       = true
                                
                                // stop iteration
                                return false
                            }
                        }
    
                    } else {
                        var status = childNode.computeFolderStatus()
    
                        if (status == 'red') {
                            allGreen            = false
                            hasFailed           = true
    
                            // stop iteration
                            return false
                        }
                        
                        if (result.isWorking() || status == 'working') {
                            isWorking           = true
    
                            // stop iteration
                            return false
                        }
    
                        if (status == 'yellow')
                            allGreen            = false
                    }
                })
    
                if (isWorking)  return 'working'
                if (hasFailed)  return 'red'
                if (allGreen)   return 'green'
    
                return 'yellow'
            }
            
        }, isSenchaTouch ? { config : config } : config),
        
        function () {
            if (!isSenchaTouch) {
                Ext.data.NodeInterface.decorate(this);
    
                this.override({
                    expand : function () {
                        Ext.suspendLayouts();
                        this.callParent(arguments);
                        Ext.resumeLayouts();
                    }
                });
            }
        }
    );
})();
