/**
 * @constructor
 */
SenchaInspector.Viewport = function()
{
    var me = this;
    
    me.element = document.querySelector('.west-panel');
    me.element.addEventListener('click', me.onElementClick.bind(me), false);

    me.panels = {
        home: 'HomePanel',
        components: 'ComponentsPanel',
        stores: 'StoresPanel'
    };
    me.renderedPanels = [];
    
    SenchaInspector.EventBus.addEventListener('check-framework', me.onCheckFramework.bind(me));
    me.onCheckFramework();
};

SenchaInspector.Viewport.prototype = {
    
    onElementClick: function(e) {
        var action      = e.target.getAttribute('data-action'),
            listItem    = e.target.enclosingNodeOrSelfWithClass('list-item'),
            selectedItem= this.element.querySelector('.selected');
        
        if (this.element.getAttribute('disabled')) {
            return;
        }
        
        if (listItem && !listItem.hasStyleClass('selected')) {
            listItem.addStyleClass('selected');
            
            if (selectedItem) {
                selectedItem.removeStyleClass('selected');
            }
            
            this.renderPanel(listItem.getAttribute('data-panel'));
        }

        if (action && this.activePanel) {
            this.activePanel[action]();
        }
    },
    
    onCheckFramework: function() {
        var me = this;
        
        SenchaInspector.InspectedWindow.getFrameworkVersion(function(versions) {
            if (!versions) {
                me.renderPanel('home').showFrameworkNotFound();
            }
            else {
                me.element.removeAttribute('disabled');
            }
        });
    },
    
    renderPanel: function(panelId) {
        var panel, panelClass,
            activePanel = this.activePanel;
            
        if (activePanel && activePanel.panelId === panelId) {
            return activePanel;
        }
        
        panel = this.getRenderedPanelById(panelId);
        
        if (!panel) {
            panelClass = SenchaInspector[this.panels[panelId]];
            panel = new panelClass(document.body);
            panel.panelId = panelId;
            this.renderedPanels.push(panel);
        }
        
        if (activePanel) {
            activePanel.hide();
        }
        
        this.activePanel = panel;
        panel.show();
        return panel;
    },
    
    getRenderedPanelById: function(panelId) {
        var i = 0,
            renderedPanels = this.renderedPanels,
            len = renderedPanels.length;
            
        for (; i < len; i++) {
            if (renderedPanels[i].panelId === panelId) {
                return renderedPanels[i];
            }
        }
        
        return null;
    },
    
    
    updateProperties: function()
    {
        var propertiesSidebarPane = this.sidebarPanes.properties;
        propertiesSidebarPane.update(this.selectedDOMNode());
        propertiesSidebarPane.needsUpdate = false;
    },
    
    selectedDOMNode: function()
    {
        return {
            '__identifier'      : "_15",
            '_attributes'       : [],
            '_attributesMap'    : {},
            '_childNodeCount'   : 0,
            '_children'         : [],
            '_descendantUserPropertyCounters': {},
            '_domAgent': null,
            '_isInShadowTree': false,
            '_localName': "body",
            '_nodeName': "BODY",
            '_nodeType': 1,
            '_nodeValue': "",
            '_shadowRoots': [],
            '_userProperties': {},
            'firstChild': null,
            'id': 283,
            'index': 1,
            'lastChild': null,
            'nextSibling': null,
            'ownerDocument': null,
            'parentNode': null,
            'previousSibling': null
        };
    }
};