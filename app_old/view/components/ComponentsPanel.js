/**
 * Displays the Component Tree
 * 
 * @extends {AppInspector.Panel}
 */
AppInspector.ComponentsPanel = function() {
    var me = this;
        
    AppInspector.Panel.apply(me, arguments);
    
    var boxElement = document.createElement('div');
    boxElement.className = 'box-wrapper';
    
    // create tree outline
    me.treeOutline = new AppInspector.ComponentsTreeOutline();
    boxElement.appendChild(me.treeOutline.element);
    
    // create properties panel
    me.propertiesPanel = new AppInspector.ComponentPropertiesPanel(boxElement);
    
    me.element.appendChild(boxElement);
};
AppInspector.ComponentsPanel.prototype = {
    panelId: 'components',
    
    load: function() {
        var treeOutline = this.treeOutline;
        treeOutline.removeChildren();
        
        window.setTimeout(function() {
            AppInspector.InspectedWindow.getComponentTree(function(components) {
                var title,
                    i = 0,
                    len = components.length;

                for (; i < len; i++) {
                    treeOutline.appendChild(new AppInspector.ComponentTreeElement(components[i]));
                }
            });
        }, 200); // give some user feedback
    },
    
    onreload: function() {
        this.treeOutline.removeChildren();
    },
    
    __proto__: AppInspector.Panel.prototype
};

/**
 * Defines the Tree View for Component Inspector.
 * @extends {TreeOutline}
 */
AppInspector.ComponentsTreeOutline = function() {
    var element,
        me = this;
    
    // create tree element
    me.element = element = document.createElement('ol');
    element.className = 'treepanel components-tree monospace source-code';
    element.addEventListener('mousemove',   me.onmousemove.bind(me), false);
    element.addEventListener('mouseout',    me.onmouseout.bind(me), false);

    TreeOutline.call(this, this.element);
};

AppInspector.ComponentsTreeOutline.prototype = {

    treeElementFromEvent: function(event){
        var element,
            scrollContainer = this.element,

            // We choose this X coordinate based on the knowledge that our list
            // items extend at least to the right edge of the outer <ol> container.
            // In the no-word-wrap mode the outer <ol> may be wider than the tree container
            // (and partially hidden), in which case we are left to use only its right boundary.
            x = scrollContainer.totalOffsetLeft() + scrollContainer.offsetWidth - 36,
            y = event.pageY,

            // Our list items have 1-pixel cracks between them vertically. We avoid
            // the cracks by checking slightly above and slightly below the mouse
            // and seeing if we hit the same element each time.
            elementUnderMouse = this.treeElementFromPoint(x, y),
            elementAboveMouse = this.treeElementFromPoint(x, y - 2);

        if (elementUnderMouse === elementAboveMouse) {
            element = elementUnderMouse;
        }
        else {
            element = this.treeElementFromPoint(x, y + 2);
        }

        return element;
    },
        
    onmousemove: function(event) {
        var element = this.treeElementFromEvent(event);
        if (element && this._previousHoveredElement === element){
            return;
        }
        
        if (this._previousHoveredElement) {
            this._previousHoveredElement.hovered = false;
            delete this._previousHoveredElement;
        }
        
        if (element) {
            element.hovered = true;
            this._previousHoveredElement = element;
        }
        
        if (element && element.representedObject) {
            AppInspector.InspectedWindow.highlightDOMNode(element.representedObject.id);
        }
        else {
            AppInspector.InspectedWindow.hideDOMNodeHighlight();
        }
    },

    onmouseout: function(event) {
        var nodeUnderMouse = document.elementFromPoint(event.pageX, event.pageY);
        if (nodeUnderMouse && nodeUnderMouse.isDescendant(this.element)){
            return;
        }
        
        if (this._previousHoveredElement) {
            this._previousHoveredElement.hovered = false;
            delete this._previousHoveredElement;
        }
        
        AppInspector.InspectedWindow.hideDOMNodeHighlight();
    },
    
    __proto__: TreeOutline.prototype
};

/**
 * Defines a Tree Element node inside Components Tree View
 * @extends {TreeElement}
 */
AppInspector.ComponentTreeElement = function(component)
{
    var title = '<span class="dark-magenta">'+component.xclass+'</span> '+
                '<span class="dark-sienna">(';
    if (component.xtype) {
        title += 'xtype=<span class="dark-blue">'+component.xtype+'</span>, ';
    }
    title += 'id=<span class="dark-blue">'+component.id+'</span>)</span>';
    
    TreeElement.call(this, title, component, component.items && component.items.length ? true : false);
};
AppInspector.ComponentTreeElement.prototype = {
    
    get hovered() {
        return this._hovered;
    },

    set hovered(x) {
        if (this._hovered === x){
            return;
        }
        
        this._hovered = x;

        if (this.listItemElement) {
            if (x) {
                this.updateSelection();
                this.listItemElement.addStyleClass("hovered");
            } 
            else {
                this.listItemElement.removeStyleClass("hovered");
            }
        }
    },
    
    onpopulate: function() {
        if (this.children.length) {
            return;
        }
        
        var items   = this.representedObject.items||[],
            len     = items.length,
            i       = 0;
            
        for (; i < len; i++) {
            this.appendChild(new AppInspector.ComponentTreeElement(items[i]));
        }
    },
    
    onattach: function() {
        if (this._hovered) {
            this.updateSelection();
            this.listItemElement.addStyleClass("hovered");
        }
    },
    
    ondblclick: function(event) {
        if (this.hasChildren && !this.expanded) {
            this.expand();
        }
    },
    
    onselect: function(selectedByUser) {
        var cmpId = this.representedObject ? this.representedObject.id : 0;
        
        this.treeOutline.suppressRevealAndSelect = true;
        if (selectedByUser){
            AppInspector.InspectedWindow.highlightDOMNode(cmpId);
        }
        this.updateSelection();
        this.treeOutline.suppressRevealAndSelect = false;
        
        AppInspector.EventBus.fireEvent('component-selected', cmpId);
        
        return true;
    },
    
    updateSelection: function() {
        var listItemElement = this.listItemElement;
        if (!listItemElement)
            return;

        if (!this._readyToUpdateSelection) {
            if (document.body.offsetWidth > 0)
                this._readyToUpdateSelection = true;
            else {
                // The stylesheet hasn't loaded yet or the window is closed,
                // so we can't calculate what we need. Return early.
                return;
            }
        }

        if (!this.selectionElement) {
            this.selectionElement = document.createElement("div");
            this.selectionElement.className = "selection selected";
            listItemElement.insertBefore(this.selectionElement, listItemElement.firstChild);
        }

        this.selectionElement.style.height = listItemElement.offsetHeight + "px";
    },
    
    __proto__: TreeElement.prototype
};