/**
 * @class AI.ux.data.proxy.InspectedWindow
 * @author Arthur Kay (@arthurakay)
 */
Ext.define('AI.ux.data.proxy.InspectedWindow', {
    extend : 'Ext.data.proxy.Proxy',
    alias  : 'proxy.inspectedwindow',

    requires : [
        'AI.util.InspectedWindow',
        'AI.util.Store'
    ],

    inspectedStoreId : '',

    read : function (operation, callback, scope) {
        var scope = scope || this,
            records = [];

        AI.util.InspectedWindow.eval(
            AI.util.Store.getRecords,
            [ this.inspectedStoreId, operation.start ],
            function (result, isException) {
                Ext.each(result.records, function (record) {
                    var model = Ext.create('AI.model.Record', record);

                    records.push(model);
                });

                Ext.apply(operation, {
                    resultSet : {
                        records      : records,
                        count        : records.length,
                        totalRecords : result.totalCount,
                        total        : result.totalCount
                    }
                });

                operation.setCompleted();
                operation.setSuccessful();

                Ext.Function.defer(function () {
                    Ext.callback(callback, scope, [operation]);
                }, 10);
            }
        );
    }
});