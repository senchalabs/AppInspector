// http://developer.chrome.com/extensions/devtools.html

/**
 * Sencha Panel
 */
chrome.devtools.panels.create(
    "Sencha",
    "resources/images/panel_icon.png",
    "AppInspector/index.html",
    function (senchaPanel) {

        //right-click context menu
//        chrome.contextMenus.create({
//            'title'    : 'Open App Inspector for Sencha...',
//            'contexts' : [ 'all' ],
//            'onclick'  : function (info, tab) {
//                //TODO: one day allow the user to open DevTools and navigate directly to the Sencha Tab
//                //      but right now this isn't possible
//                //      http://stackoverflow.com/questions/6801577/can-i-programmatically-open-the-devtools-from-a-google-chrome-extension
//            }
//        });
    }
);

/**
 * Elements Side Panel
 */
var elementsPanel = chrome.devtools.panels.elements;

elementsPanel.createSidebarPane("Sencha Component", function (sidebar) {
    var onSelectionChanged = function() {
        sidebar.setExpression("(" + pageDetectSenchaComponent.toString() + ")()");
    };

    onSelectionChanged();

    // selection listener
    elementsPanel.onSelectionChanged.addListener(onSelectionChanged);
});

var pageDetectSenchaComponent = function () {
    var cmp, data, xtype,
        selectedEl = $0, //https://developers.google.com/chrome-developer-tools/docs/commandline-api#0_-_4
        ref = '';

    if (window.Ext) {
        cmp = Ext.getCmp(selectedEl.id);

        if (cmp) {
            data = Object.create(null); //which sets __proto__ to undefined

            // class name
            if (Ext.getClassName) {
                ref = Ext.getClassName(cmp);
            }

            // xtype
            xtype = cmp.xtype || (cmp.getXType ? cmp.getXType() : '');

            if (xtype) {
                ref += ' (' + xtype + ')';
            }

            if (!ref) {
                ref = '#' + cmp.id;
            }

            data[ref] = cmp;
        }

    }

    return data;
};