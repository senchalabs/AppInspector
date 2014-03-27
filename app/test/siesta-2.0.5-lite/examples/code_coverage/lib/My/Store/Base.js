;(function () {

    Ext.define('My.Store.Base', {
        extend          : 'Ext.data.Store',
        
        requires        : [ 'My.Util.SomeClass' ],
        
        someMethod : function () {
            return 'value'
        }
    })    
    
})()

