/**
 * Singleton object responsible for fetching information from the 
 * inspected window using chrome.devTools.inspectedWindow API
 * 
 * For every API created here, add a correspondant on InspectedWindowMock.js.
 * 
 * @see <a href="http://developer.chrome.com/extensions/devtools_inspectedWindow.html">chrome.devTools.inspectedWindow API</a>
 */
AppInspector.InspectedWindow = {
    
    /**
     * In case the inspector is running outside the dev tools context (e.g. openning inspector.html directly on the browser
     * for development), switch this API for a Mock API.
     */
    checkAPI: function(callback) {
        if (!window.chrome || !window.chrome.devtools) {
            var script = document.createElement('script');
            script.src = 'app/api/InspectedWindowMock.js';
            script.onload = function() {
                if (AppInspector.InspectedWindow.isMock) {
                    console.warn('Inspector is not running under Chrome Dev Tools context. Enabling InspectedWindow Mockup to emulate inspected window.');
                }
            
                callback();
                script.onload = null;
            };
            
            document.body.appendChild(script);
        }
        else {
            callback();
        }
    },
    
    getFrameworkVersion: function(callback) {
        function injectedGetFrameworkVersion() {
            var version;
            
            if (!window.Ext) {
                return null;
            }
            
            // ext 4 and touch
            if (Ext.versions) {
                version = Ext.versions;
            }
            //ext 3
            else if (Ext.versionDetail) {
                version = {
                    core: Ext.versionDetail,
                    extjs: Ext.versionDetail
                };
            }

            return version;
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
                            xclass  : Ext.getClassName  ? Ext.getClassName(cmp) : "",
                            xtype   : cmp.getXType      ? cmp.getXType()        : cmp.xtype,
                            id      : cmp.getId         ? cmp.getId()           : cmp.id,
                            itemId  : cmp.getItemId     ? cmp.getItemId()       : cmp.itemId,
                            name    : cmp.getName       ? cmp.getName()         : cmp.name
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
            
            // ext 4
            if (Ext.ComponentMgr.each) {
                Ext.ComponentMgr.each(eachComponent);
            }
            
            // touch and ext 3
            else if (Ext.ComponentMgr.all && Ext.ComponentMgr.all.map) {
                map = Ext.ComponentMgr.all.map;
                for (id in map) {
                    eachComponent(id, map[id]);
                }
            }

            return componentTree;
        }

        chrome.devtools.inspectedWindow.eval("(" + injectedGetComponentTree + ")()", function(result, isException) 
        {
            callback(isException ? null : result);
        });
    },
    
    getComponent: function(cmpId, callback) {
        this.getComponentProperty(cmpId, '', callback);
    },
    
    getComponentProperty: function(cmpId, key, callback) {
        function injectedGetComponentProperty() {
            function isArray(v){
                return toString.apply(v) === '[object Array]';
            }
            
            function isObject(v){
                return !!v && Object.prototype.toString.call(v) === '[object Object]';
            }
            
            function isString(v){
                return typeof v === 'string';
            }
            
            function isNumber(v){
                return typeof v === 'number' && isFinite(v);
            }
            
            if (!window.Ext) {
                return null;
            }
            
            var key, value, type, 
                inspectKey  = "_KEY_",
                inspectedObj= Ext.getCmp("_COMPONENTID_"),
                result      = [];
            
            // dive into the object using key (e.g. layout.sizeModel.shrinkWrap)
            if (inspectKey !== '') {
                inspectKey = inspectKey.split('.');
                while (inspectedObj && inspectKey.length) {
                    inspectedObj = inspectedObj[inspectKey.shift()];
                }
            }
            
            if (inspectedObj) {
                for (key in inspectedObj) {
                    if (inspectedObj.hasOwnProperty(key)) {
                        value = inspectedObj[key];
                        type = '';
                        
                        if (typeof value === 'undefined') {
                            type = 'undefined';
                            value = 'undefined';
                        }
                        else if (isArray(value)) {
                            type = 'array';
                            value = 'Array['+value.length+']';
                        }
                        else if (isObject(value)) {
                            type = 'object';
                            value = 'Object';
                        }
                        else if (isString(value)) {
                            type = 'string';
                            value = '"' + value + '"';
                        }
                        else if (isNumber(value)) {
                            type = 'number';
                        }
                        else {
                            value = '' + value;
                        }
                        
                        result.push({
                            key     : key,
                            value   : value,
                            type    : type
                        });
                    }
                }
            }
            
            return result;
        };

        chrome.devtools.inspectedWindow.eval(
            "(" + injectedGetComponentProperty.toString()
                .replace(/\_COMPONENTID\_/g, cmpId)
                .replace(/\_KEY\_/g, key) + ")()",
            function(result, isException) {
                callback(isException ? null : result);
            }
        );
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
                Ext.destroy(elHighlight);
            }
        }     
        
        chrome.devtools.inspectedWindow.eval(
            "(" + injectedHideDOMNodeHighlight + ")()",
             function() {}
        );
    }
};