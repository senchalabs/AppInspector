Ext.define('My.Store.EventStore', {
    extend          : 'My.Store.Base',
    
    model           : 'My.Model.Event',
    
    proxy           : 'memory',
    
    someMethod : function () {
        return 'value'
    }
})    
