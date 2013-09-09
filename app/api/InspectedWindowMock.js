/**
 * In case any developer needs to open inspector.html directly on a browser, outside the
 * chrome dev tools context, this JS will be automatically loaded by InspectedWindow.js
 * to keep the inspector usable with mock data.
 * 
 * For every API created here, add a correspondant on InspectedWindow.js.
 */
AppInspector.InspectedWindow = {
    isMock: true,
    
    getFrameworkVersion: function(callback) 
    {
        callback({
            "core": {
                "shortVersion": "410",
                "version": "4.1.0",
                "major": 4,
                "minor": 1,
                "patch": 0,
                "build": 0
            },
            "touch": {
                "shortVersion": "221",
                "version": "2.2.1",
                "major": 2,
                "minor": 2,
                "patch": 1,
                "build": 0
            }
        });
    },
    
    getComponentTree: function(callback) {
        callback([{
            xclass: 'Ext.container.Viewport',
            xtype: 'viewport',
            id: 'viewport-1000',
            items: [{
                xclass: 'Ext.panel.Panel',
                xtype: 'panel',
                id: 'panel-1000'
            },{
                xclass: 'Ext.panel.Panel',
                xtype: 'panel',
                id: 'panel-1001'
            },{
                xclass: 'Ext.panel.Panel',
                xtype: 'panel',
                id: 'panel-1002'
            }]
        },{
            xclass: 'Ext.menu.Menu',
            xtype: 'menu',
            id: 'menu-1001'
        }]);
    },
    
    getComponent: function(cmpId, callback) {
        callback([{
            "key": "initialConfig",
            "value": "Object",
            "type": "object"
        }, {
            "key": "events",
            "value": "Object",
            "type": "object"
        }, {
            "key": "autoGenId",
            "value": "true",
            "type": "bool"
        }, {
            "key": "id",
            "value": "messagebox-1001",
            "type": "string"
        }, {
            "key": "componentLayout",
            "value": "Object",
            "type": "object"
        }, {
            "key": "componentCls",
            "value": "x-window",
            "type": "string"
        }, {
            "key": "protoEl",
            "value": "Object",
            "type": "object"
        }]);
    },
    
    getComponentProperty: function(cmpId, key, callback) {
        callback([{
            "key"   : "__proto__",
            "value" : "Object",
            "type"  : "object"
        }]);
    },
    
    highlightDOMNode: function(id) {
        console.log('highlight DOM ' + id);
    },
    
    hideDOMNodeHighlight: function() {
        console.log('hide DOM highlight');
    }
};