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

    /**
     * @cfg {String/Function} evalFn The function to evaluate in the inspected window.
     */
    evalFn : null,
    /**
     * @cfg {String} inspectedStoreId The storeId of the store.
     */
    inspectedStoreId : null,

    read : function (operation, callback, scope) {
        scope = scope || this;

        var records = [],
            evalFn  = this.evalFn,
            reader  = this.getReader(),
            model   = reader.model;

        if (Ext.isString(evalFn)) {
            //can resolve better, split by . and resolve each part
            evalFn = eval(evalFn);
        }

        AI.util.InspectedWindow.eval(
            evalFn,
            [ this.inspectedStoreId, operation.start ],
            function (result) {
                Ext.each(result.records, function (record) {
                    records.push(Ext.create(model, record));
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
