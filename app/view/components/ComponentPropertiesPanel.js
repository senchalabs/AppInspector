/**
 * Displays more info about properties on a given component
 * as a tree view.
 * 
 * @extends {AppInspector.SidePanel}
 */
AppInspector.ComponentPropertiesPanel = function() {
    var me = this;
    
    AppInspector.SidePanel.apply(me, arguments);
    
    // create tree outline
    me.treeOutline = new AppInspector.ComponentPropertiesOutline();
    me.element.appendChild(me.treeOutline.element);
    
    // listen for event
    AppInspector.EventBus.addEventListener('component-selected', me.onComponentSelected.bind(me));
};
AppInspector.ComponentPropertiesPanel.prototype = {
    load: function(cmpId) {
        var treeOutline = this.treeOutline;
        treeOutline.removeChildren();
        
        AppInspector.InspectedWindow.getComponent(cmpId, function(properties) {
            var i = 0,
                len = properties.length;
                
            properties.sort(function(a, b) {
                if (a.key < b.key) {
                    return -1;
                }
                else if (a.key > b.key) {
                    return 1;
                }
                
                return 0;
            });

            for (; i < len; i++) {
                treeOutline.appendChild(new AppInspector.ComponentPropertyTreeElement(cmpId, properties[i]));
            }
        });
    },
    
    onComponentSelected: function(cmpId) {
        this.load(cmpId);
    },
    
    __proto__: AppInspector.SidePanel.prototype  
};

/**
 * Defines the Tree View for Component Properties sidepanel.
 * @extends {TreeOutline}
 */
AppInspector.ComponentPropertiesOutline = function() {
    var element,
        me = this;
    
    // create tree element
    me.element = element = document.createElement('ol');
    element.className = 'treepanel component-properties-tree monospace source-code';

    TreeOutline.call(this, this.element);
};
AppInspector.ComponentPropertiesOutline.prototype = {
    __proto__: TreeOutline.prototype
};

/**
 * Defines a Tree Element node inside Component Properties Tree View
 * @extends {TreeElement}
 */
AppInspector.ComponentPropertyTreeElement = function(cmpId, property)
{
    var hasChildren,
        valueCls= 'black',
        value   = property.value,
        type    = property.type;
    
    if (type === 'undefined') {
        valueCls = 'gray';
    }
    else if (type === 'number') {
        valueCls = 'dark-blue';
    }
    else if (type === 'string') {
        valueCls = 'red';
    }
    else if (type === 'object' || type === 'array') {
        hasChildren = true;
    }
    
    var title = '<span class="dark-magenta">'+property.key+'</span>: '+
                '<span class="'+ valueCls +'">'+value+'</span>';
    
    this.cmpId = cmpId;
    TreeElement.call(this, title, property, hasChildren);
};
AppInspector.ComponentPropertyTreeElement.prototype = {
    select: function() {},
    
    onpopulate: function() {
        var me          = this,
            cmpId       = me.cmpId,
            inspectKey  = [me.representedObject.key],
            parent      = me.parent;
        
        if (me.children.length) {
            return;
        }
        
        while(parent && parent.representedObject && parent.representedObject.key) {
            inspectKey.unshift(parent.representedObject.key);
            parent = parent.parent;
        }
        
        AppInspector.InspectedWindow.getComponentProperty(cmpId, inspectKey.join('.'), function(properties) {
            var len = properties.length,
                i = 0;
            
            for (; i < len; i++) {
                me.appendChild(new AppInspector.ComponentPropertyTreeElement(cmpId, properties[i]));
            }
        });
    },
    
    ondblclick: function(event) {
        if (this.hasChildren && !this.expanded) {
            this.expand();
        }
    },
    
    __proto__: TreeElement.prototype
};