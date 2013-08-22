/**
 * @constructor
 */
SenchaInspector.Panel = function(renderTo)
{
    this.element = document.createElement("div");
    this.element.addStyleClass('panel');
    this.element.addStyleClass(this.panelId + '-panel');
    
    this.element.__view = this;
    this._visible = true;
    this._isRoot = false;
    this._isShowing = false;
    this._children = [];
    this._hideOnDetach = false;
    this._cssFiles = [];
    this._notificationDepth = 0;
    
    renderTo.appendChild(this.element);
};

SenchaInspector.Panel.prototype = {
    
    //defined by children
    panelId: null, 
    load: null,
    
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