/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.CanFillAssertionsStore', {

    processNewResult : function (assertionStore, test, result, parentResult) {
        var data            = {
            id                  : result.id,
            
            result              : result,
            
            loaded              : true,
            leaf                : !(result instanceof Siesta.Result.SubTest),
            expanded            : (result instanceof Siesta.Result.SubTest) && result.test.specType != 'it'
        };
        
        var alreadyInTheStore   = assertionStore.getById(result.id)
        
        if (alreadyInTheStore) {
            alreadyInTheStore.triggerUIUpdate()
        } else {
            Ext.suspendLayouts()
            
            alreadyInTheStore   = (assertionStore.getById(parentResult.id) || assertionStore.getRootNode()).appendChild(data);
            
            Ext.resumeLayouts()
        }
        
        if (result.isPassed && !result.isPassed()) alreadyInTheStore.ensureVisible()
        
        alreadyInTheStore.updateFolderStatus()
    },
    

    // is bubbling and thus triggered for all tests (including sub-tests) 
    processEveryTestEnd : function (assertionStore, test) {
        var testResultNode  = assertionStore.getById(test.getResults().id)
        
        // can be missing for "root" tests
        testResultNode && testResultNode.updateFolderStatus()
    }
})
