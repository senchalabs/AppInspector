/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
(function () {
    var config = {
        idProperty : 'id',

        fields : [
            'id',
            'url',

            'title',

            { name : 'passCount', type : 'int', defaultValue : 0 },
            { name : 'failCount', type : 'int', defaultValue : 0 },
            { name : 'todoPassCount', type : 'int', defaultValue : 0 },
            { name : 'todoFailCount', type : 'int', defaultValue : 0 },

            { name : 'time', type : 'int', defaultValue : 0 },

            { name : 'checked', defaultValue : false },

            { name : 'folderStatus', defaultValue : 'yellow' },

            // will be set to true for all tests, once the users clicks "run"
            'isStarting',
            // will be set to true, right before the scope preload begin
            'isStarted',
            // will be set to true, after preload ends and tests launch
            { name : 'isRunning', type : 'boolean', defaultValue : false },
            { name : 'isMissing', type : 'boolean', defaultValue : false },
            { name : 'isFailed', type : 'boolean', defaultValue : false },

            // composite objects
            'assertionsStore',
            'test',
            'descriptor'
        ]
    };
    
    var isSenchaTouch = Ext.getVersion && Ext.getVersion('touch')

    Ext.define(
        'Siesta.Harness.Browser.Model.TestFile',
        
        Ext.apply({
            extend      : 'Ext.data.Model',
            
            init        : function () {
                this.internalId = this.getId() || this.internalId
            },
    
            computeFolderStatus : function () {
                if (!this.childNodes.length) return 'yellow'
    
                var isWorking = false
                var hasFailed = false
                var allGreen = true
    
                Joose.A.each(this.childNodes, function (childNode) {
    
                    if (childNode.isLeaf()) {
                        var test = childNode.get('test')
    
                        if (test && test.isFailed()) {
                            allGreen = false
                            hasFailed = true
    
                            // stop iteration
                            return false
                        }
    
                        if (!test && childNode.get('isStarting'))    isWorking = true
                        if (test && !test.isFinished())     isWorking = true
                        if (test && !test.isPassed())       allGreen = false
                        if (!test)                          allGreen = false
    
                    } else {
                        var status = childNode.computeFolderStatus()
    
                        if (status == 'red') {
                            allGreen = false
                            hasFailed = true
    
                            // stop iteration
                            return false
                        }
    
                        if (status == 'working') {
                            isWorking = true
    
                            // stop iteration
                            return false
                        }
    
                        if (status == 'yellow')         allGreen = false
                    }
                })
    
                if (isWorking)  return 'working'
                if (hasFailed)  return 'red'
                if (allGreen)   return 'green'
    
                return 'yellow'
            },
    
    
            updateFolderStatus : function () {
                this.set('folderStatus', this.computeFolderStatus())
    
                var parentNode = this.parentNode
    
                if (parentNode && !parentNode.isRoot()) parentNode.updateFolderStatus()
            }
        }, isSenchaTouch ? { config : config } : config),
        // eof Ext.apply
        
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
    )
})();
