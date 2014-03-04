'use strict';

/**
 * Elements Side Panel
 */
var elementsPanel = chrome.devtools.panels.elements,

    pageDetectSenchaComponent = function pageDetectSenchaComponent() {
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

elementsPanel.createSidebarPane('Sencha Component', function (sidebar) {
    var onSelectionChanged = function () {
        sidebar.setExpression('(' + pageDetectSenchaComponent.toString() + ')()');
    };

    onSelectionChanged();

    // selection listener
    elementsPanel.onSelectionChanged.addListener(onSelectionChanged);
});