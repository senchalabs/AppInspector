AppInspector = {};

/**
 * Helper to stop an event
 */
Event.prototype.stopEvent = function() {
    this.stopPropagation();
    this.preventDefault();  
};