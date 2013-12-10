/**
 * A global object using observable pattern to facilitate
 * communication across views
 */
AppInspector.EventBus = {
    _listeners: {},
    
    addEventListener: function(eventName, listener) {
        this._listeners[eventName] = this._listeners[eventName]||[];
        this._listeners[eventName].push(listener);
    },
    
    removeEventListener: function(eventName, listener) {
        this.forEachListener(eventName, function(eventListener, i, eventListeners) {
            if (eventListener === listener) {
                eventListeners.splice(i, 1);
                return false;
            }
        });
    },
    
    fireEvent: function() {
        var args        = Array.prototype.slice.call(arguments, 0),
            eventName   = args.shift();
        
        this.forEachListener(eventName, function(listener) {
            listener.apply(this, args);
        });
    },
    
    forEachListener: function(eventName, callback) {
        var i, len,
            eventListeners  = this._listeners[eventName];
        
        if (eventListeners) {
            i = 0;
            len = eventListeners.length;
            for (; i<len; i++) {
                if (callback(eventListeners[i], i, eventListeners) === false) {
                    break;
                }
            }
        }
    }
};