/**
 * Base class for Panels
 */
AppInspector.Panel = function(renderTo)
{
    this.element = document.createElement("div");
    this.element.addStyleClass('panel');
    this.element.addStyleClass(this.panelId + '-panel');
    this.element.__view = this;
    
    renderTo.appendChild(this.element);
};

AppInspector.Panel.prototype = {
    
    //defined by children
    panelId: null, 
    load: null,
    onreload: function() {},
    
    show: function() {
        this.element.style.display = 'block';
        this.load();
    },
    
    hide: function() {
        this.element.style.display = 'none';
    },
    
    refresh: function() {
        this.load();
    }
};