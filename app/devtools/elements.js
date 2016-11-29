'use strict';

/**
 * Elements Side Panel
 */

var elementsPanel = chrome.devtools.panels.elements,

    pageDetectSenchaComponent = function pageDetectSenchaComponent() {
        var cmp, data, xtype,
            selectedEl = $0, //https://developers.google.com/chrome-developer-tools/docs/commandline-api#0_-_4
            ref = '';


        var getComponentOrParent = function(domEl, classPrefix) {
            var cmp = cmp = Ext.getCmp(domEl.id);
            ///
            if (cmp && (!classPrefix || Ext.getClassName(cmp).indexOf(classPrefix) > -1 )) {
                return cmp;
            } else if (domEl && domEl.parentNode && domEl.parentNode != document.body){
                return getComponentOrParent(domEl.parentNode, classPrefix);
            }
            //
        };

        var getData = function(cmp) {
            var data;
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
            return data;
        }

        data = Object.create(null); //which sets __proto__ to undefined

        

        if (window.Ext) {
            cmp = getComponentOrParent(selectedEl);           

            

            var names = [];
            try {
                names = Ext.ClassManager.names.reduce((a,b) => (a.indexOf(b)==-1) ? a + ","+ b : a).split(',') ;
            } catch(e) {
                names = Object.keys(Ext.ClassManager.classes)
                    .filter((k) => k.indexOf("Ext") == -1)
                    .map((k) => k.substr(0, k.indexOf(".")))
                    .reduce((a,b) => (a.indexOf(b) == -1) ? (a + "," + b) :  a)
                    .split(",").filter(v => v.length > 0);
            }    
            
            var addedPrefixes = 0;
            names.forEach(function(name) {
                var prefixedCmp = getComponentOrParent(selectedEl, name);
                if (prefixedCmp && prefixedCmp != cmp) {
                    data[name] = getData(prefixedCmp);
                    addedPrefixes++;
                }
            });

            if (addedPrefixes === 0) {
                data = getData(cmp);
            } else {
                data['$0'] = getData(cmp);
            }

            
        }

        return data;
    };

elementsPanel.createSidebarPane('Sencha/ExtJS', function (sidebar) {
    var onSelectionChanged = function () {
        sidebar.setExpression('(' + pageDetectSenchaComponent.toString() + ')()');
    };

    onSelectionChanged();

    // selection listener
    elementsPanel.onSelectionChanged.addListener(onSelectionChanged);
});