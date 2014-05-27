StartTest({
    preload : [
        '../AppInspector/mocks.js',
        '../AppInspector/app/util/Error.js',
        '../AppInspector/app/util/InspectedWindow.js',
        '../AppInspector/app/util/TreeStore.js'
    ]
}, function (test) {

    //=================================================================
    test.diag("AI.util.TreeStore.getChildNodes()");

    AI.util.InspectedWindow.eval(
        AI.util.TreeStore.getChildNodes,

        //id of store is specific to the example!
        [ 'Files', 0 ],

        function(treeRoot, isException) {
            test.isObject(treeRoot, '"treeRoot" is an object');
        }
    );
});
