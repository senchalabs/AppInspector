/**
 * Base class for Side Panels
 */
AppInspector.SidePanel = function(renderTo)
{
    this.element = document.createElement("div");
    this.element.addStyleClass('side-panel');
    this.element.__view = this;
    
    renderTo.appendChild(this.element);
};

AppInspector.SidePanel.prototype = {
};