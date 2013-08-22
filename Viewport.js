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
    
    // check framework
    SenchaInspector.EventBus.addEventListener('check-framework', me.onCheckFramework.bind(me));
    me.onCheckFramework();

    // connect to background
    if (window.chrome) {
        var port = chrome.runtime.connect({name: 'sencha-inspector'});
        port.postMessage({
            action: 'connect',
            tabId: chrome.devtools.inspectedWindow.tabId
        });
        port.onMessage.addListener(function(msg) {
            if (msg === 'refresh') {
                me.onInspectedWindowRefresh();
            }
        });
    }
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
        var selectedItem,
            me = this;
            
        SenchaInspector.InspectedWindow.getFrameworkVersion(function(versions) {
            if (!versions) {
                selectedItem= me.element.querySelector('.selected');
                if (selectedItem) {
                    selectedItem.removeStyleClass('selected');
                }
            
                me.element.setAttribute('disabled', 'disabled');
                me.renderPanel('home').showFrameworkNotFound();
            }
            else {
                me.renderPanel('home').index();
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
    
    onInspectedWindowRefresh: function() {
        var i = 0,
            renderedPanels = this.renderedPanels,
            len = renderedPanels.length;
                
        for (; i < len; i++) {
            renderedPanels[i].onreload();
        }
        
        this.onCheckFramework();
    }
};