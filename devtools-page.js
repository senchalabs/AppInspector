// http://developer.chrome.com/extensions/devtools.html

/**
 * Sencha Panel
 */
chrome.devtools.panels.create("Sencha", "resources/images/panel_icon.png", "inspector.html", function() {});

/**
 * Elements Side Panel
 */
var elementsPanel = chrome.devtools.panels.elements;

elementsPanel.createSidebarPane("Sencha Component", function(sidebar) {
    function onSelectionChanged() {
        sidebar.setExpression("(" + pageDetectSenchaComponent.toString() + ")()");
    }
    onSelectionChanged();

    // selection listener
    elementsPanel.onSelectionChanged.addListener(onSelectionChanged);
});

function pageDetectSenchaComponent() {
    var cmp, data, cmpRef, xtype, 
        selectedEl = $0,
        ref = '';
    
    if (window.Ext) {
        cmp = Ext.getCmp(selectedEl.id);
    
        if (cmp) {
            data = {__proto__: null};
            
            // class name
            if (Ext.getClassName) {
                ref = Ext.getClassName(cmp);
            }

            // xtype
            xtype = cmp.xtype||(cmp.getXType ? cmp.getXType() : '');
            if (xtype) {
                ref += ' ('+ xtype +')';
            }

            if (!ref) {
                ref = '#' + cmp.id;
            }

            data[ref] = cmp;
        }
    
    }

    return data;
}