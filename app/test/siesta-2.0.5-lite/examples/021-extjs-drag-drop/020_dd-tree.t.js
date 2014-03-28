StartTest(function(t) {
    var store = Ext.create('Ext.data.TreeStore', {
        proxy: {
            type: 'memory',
            data: [
               {
                  "text":"PluginManager.js",
                  "id":"src\/PluginManager.js",
                  "leaf":true,
                  "cls":"file"
               },
               {
                  "text":"XTemplate.js",
                  "id":"src\/XTemplate.js",
                  "leaf":true,
                  "cls":"file"
               },
               {
                  "text":"FocusManager.js",
                  "id":"src\/FocusManager.js",
                  "leaf":true,
                  "cls":"file"
               },
               {
                  "text":"Layer.js",
                  "id":"src\/Layer.js",
                  "leaf":true,
                  "cls":"file"
               },
               {
                  "text":"AbstractPlugin.js",
                  "id":"src\/AbstractPlugin.js",
                  "leaf":true,
                  "cls":"file"
               },
               {
                  "text":"AbstractManager.js",
                  "id":"src\/AbstractManager.js",
                  "leaf":true,
                  "cls":"file"
               },
               {
                  "text":"Action.js",
                  "id":"src\/Action.js",
                  "leaf":true,
                  "cls":"file"
               },
               {
                  "text":"Template.js",
                  "id":"src\/Template.js",
                  "leaf":true,
                  "cls":"file"
               },
               {
                  "text":"ZIndexManager.js",
                  "id":"src\/ZIndexManager.js",
                  "leaf":true,
                  "cls":"file"
               },
               {
                  "text":"Shadow.js",
                  "id":"src\/Shadow.js",
                  "leaf":true,
                  "cls":"file"
               }
            ]
        },
        root: {
            text: 'Ext JS',
            id: 'src',
            expanded: true
        },
        folderSort: true,
        sorters: [{
            property: 'text',
            direction: 'ASC'
        }]
    });

    var tree = Ext.create('Ext.tree.Panel', {
        store: store,
        viewConfig: {
            plugins: {
                ptype: 'treeviewdragdrop'
            }
        },
        rootVisible : false,
        renderTo: Ext.getBody(),
        height: 300,
        width: 250,
        title: 'Files',
        useArrows: true
    });
    
    t.waitForRowsVisible(tree, function() {
        var firstFolder = store.getRootNode().firstChild;
        
        t.dragTo(t.getCell(tree, 0, 0), t.getCell(tree, 7, 0), function() {
            t.isnt(firstFolder, store.getRootNode().firstChild, 'The old first child of the root node has changed');
        });
    });
});