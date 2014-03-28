Ext.define('My.Model.Resource', {
    extend          : 'Ext.data.Model',
    
    eventsStore     : null,
    
    fields          : [
        'Name',
        'Duration'
    ],
    
    
    getEvents : function () {
        var id      = this.getId()
        
        var events  = []
        
        this.eventsStore(function (event) {
            if (event.get('ResourceId') == id) events.push(event)
        })
        
        return events
    }
})