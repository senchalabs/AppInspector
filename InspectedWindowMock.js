/**
 * Not the real InspectedWindow. Only use this for development.
 * @constructor
 */
AppInspector.InspectedWindow = {

    getFrameworkVersion: function(callback) 
    {
        // callback(null);
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
    
    highlightDOMNode: function(id) {
        console.log('highlight DOM ' + id);
    },
    
    hideDOMNodeHighlight: function() {
        console.log('hide DOM highlight');
    }
};