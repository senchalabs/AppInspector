StartTest({
    preload : [
        '../AppInspector/mocks.js',
        '../AppInspector/app/util/Error.js',
        '../AppInspector/app/util/InspectedWindow.js',
        '../AppInspector/app/util/Component.js'
    ]
}, function (test) {

    //=================================================================
    test.diag("AI.util.Component.loadComponentTree()");

    AI.util.InspectedWindow.eval(
        AI.util.Component.loadComponentTree,
        null,
        function(nodes, isException) {
            test.isArray(nodes, '"nodes" is an array');

            test.isNot(nodes[0].text, undefined, 'Nodes have "text" property');
            test.isNot(nodes[0].cmpId, undefined, 'Nodes have "cmpId" property');
            test.isNot(nodes[0].itemId, undefined, 'Nodes have "itemId" property');
            test.isNot(nodes[0].xtype, undefined, 'Nodes have "xtype" property');
            test.isNot(nodes[0].children, undefined, 'Nodes have "children" property');
        }
    );

    //=================================================================
    test.diag("AI.util.Component.getInspectedComponent()");

    AI.util.InspectedWindow.eval(
        AI.util.Component.getInspectedComponent,

        //id of component is specific to the example!
        'ext-viewport',

        function(data, isException) {
            test.isNot(data.methods, undefined, 'data.methods exists');
            test.isNot(data.properties, undefined, 'data.properties exists');
        }
    );
});