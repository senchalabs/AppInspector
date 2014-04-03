StartTest({
    preload : [
        '../AppInspector/mocks.js',
        '../AppInspector/app/util/Error.js',
        '../AppInspector/app/util/InspectedWindow.js',
        '../AppInspector/app/util/Store.js'
    ]
}, function (test) {

    //=================================================================
    test.diag("AI.util.Store.getStores()");

    AI.util.InspectedWindow.eval(
        AI.util.Store.getStores,
        null,
        function(stores, isException) {
            test.isArray(stores, '"nodes" is an array');

            test.isNot(stores[0].id, undefined, 'Nodes have "id" property');
            test.isNot(stores[0].count, undefined, 'Nodes have "count" property');
            test.isNot(stores[0].leaf, undefined, 'Nodes have "leaf" property');
        }
    );

    //=================================================================
    test.diag("AI.util.Store.getRecords()");

    AI.util.InspectedWindow.eval(
        AI.util.Store.getRecords,

        //id of store is specific to the example!
        [ 'Restaurants', 0 ],

        function(data, isException) {
            //test the data object properties
            test.isNot(data.records, undefined, 'data.records exists');
            test.isNot(data.totalCount, undefined, 'data.totalCount exists');

            //test the individual records
            var rec = data.records[0];

            test.isNot(rec.id, undefined, 'record.id exists');
            test.isNot(rec.modelData, undefined, 'record.modelData exists');
            test.isNot(rec.rawData, undefined, 'record.rawData exists');
        }
    );
});