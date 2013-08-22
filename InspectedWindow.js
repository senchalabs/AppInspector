/**
 * @constructor
 */
SenchaInspector.InspectedWindow = {

    getFrameworkVersion: function(callback) 
    {
        function injectedGetFrameworkVersion() {
            if (!window.Ext) {
                return null;
            }

            return window.Ext.versions;
        }

        chrome.devtools.inspectedWindow.eval("(" + injectedGetFrameworkVersion + ")()", function(result, isException) 
        {
            callback(isException ? null : result);
        });
    },
    
    getComponentTree: function(callback) {
        function injectedGetComponentTree() {
            if (!window.Ext) {
                return null;
            }
            
            var id, map, 
                componentTree = [],
            
                mountComponent = function(cmp) {
                    var items = [],
                        result = {
                            xclass: Ext.getClassName(cmp),
                            xtype: cmp.getXType ? cmp.getXType() : cmp.xtype,
                            id: cmp.getId()
                        }; 
                    
                    if (cmp.items) {
                        cmp.items.each(function(item) {
                            items.push(mountComponent(item));
                        });
                        result.items = items;
                    }
                    
                    return result;
                },
                
                eachComponent = function(id, cmp) {
                    if (!cmp.ownerCt) {
                        componentTree.push(mountComponent(cmp));
                    }
                };
            
            // ext
            if (Ext.ComponentMgr.each) {
                Ext.ComponentMgr.each(eachComponent);
            }
            
            // touch
            else if (Ext.ComponentMgr.all && Ext.ComponentMgr.all.map) {
                map = Ext.ComponentMgr.all.map;
                for (id in map) {
                    eachComponent(id, map[id]);
                }
            }

            return componentTree;
        }
        injectedGetComponentTree();
        chrome.devtools.inspectedWindow.eval("(" + injectedGetComponentTree + ")()", function(result, isException) 
        {
            callback(isException ? null : result);
        });
    },
    
    highlightDOMNode: function(id) {
        function injectedHighlightDOMNode() {
            if (!window.Ext) {
                return;
            }

            var cmp         = Ext.getCmp("_COMPONENTID_"),
                elHighlight = Ext.get('_inspector_hightlightel');

            if (cmp) {
                if (!elHighlight) {
                    elHighlight = Ext.getBody().createChild({
                        tag: 'div', 
                        id: '_inspector_hightlightel',
                        style: {
                            'position'  : 'absolute',
                            'z-index'   : '999999999',
                            'opacity'   : '0.5',
                            'background': '#7eadd9'
                        }
                    });
                }
                elHighlight.setBox(cmp.element ? cmp.element.getBox() : cmp.el.getBox());
            }
        }
        
        chrome.devtools.inspectedWindow.eval(
            "(" + injectedHighlightDOMNode.toString().replace(/\_COMPONENTID\_/g, id) + ")()",
             function() {}
        );
    },
    
    hideDOMNodeHighlight: function() {
        function injectedHideDOMNodeHighlight() {
            if (!window.Ext) {
                return;
            }

            var elHighlight = Ext.get('_inspector_hightlightel');
    
            if (elHighlight) {
                elHighlight.remove();
            }
        }     
        
        chrome.devtools.inspectedWindow.eval(
            "(" + injectedHideDOMNodeHighlight + ")()",
             function() {}
        );
    }
};