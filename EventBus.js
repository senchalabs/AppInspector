AppInspector.EventBus = {
    _listeners: {},
    
    addEventListener: function(eventName, callback) {
        this._listeners[eventName] = this._listeners[eventName]||[];
        this._listeners[eventName].push(callback);
    },
    
    fireEvent: function() {
        var i, len,
            args            = Array.prototype.slice.call(arguments, 0),
            eventName       = args.shift(),
            eventListeners  = this._listeners[eventName];
        
        if (eventListeners) {
            i = 0;
            len = eventListeners.length;
            for (; i<len; i++) {
                eventListeners[i].apply(this, args);
            }
        }
    }
};