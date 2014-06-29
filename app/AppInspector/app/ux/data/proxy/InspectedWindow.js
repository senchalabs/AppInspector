/**
 * @class   AI.ux.data.proxy.InspectedWindow
 * @extends Ext.data.proxy.Proxy
 *
 * @author  Arthur Kay (@arthurakay)
 */
Ext.define('AI.ux.data.proxy.InspectedWindow', {
    extend: 'Ext.data.proxy.Proxy',
    alias: 'proxy.inspectedwindow',

    requires: [
        'AI.util.InspectedWindow',
        'AI.util.Store'
    ],

    config: {
        /**
         * @cfg {String/Function} evalFn The function to evaluate in the inspected window.
         */
        evalFn: null,

        /**
         * @cfg {String} inspectedStoreId The storeId of the store.
         */
        inspectedStoreId: null
    },

    read: function(operation, callback, scope) {
        scope = scope || this;

        var evalFn = this.evalFn;

        if (Ext.isString(evalFn)) {
            //can resolve better, split by . and resolve each part
            evalFn = eval(evalFn);
        }

        AI.util.InspectedWindow.eval(
            evalFn, [this.inspectedStoreId, operation.getStart()],
            function(result) {
                var resultSet = scope.getReader().read(result.records);

                resultSet.setTotal(result.totalCount);
                operation.process(resultSet, null, null, true);

                Ext.Function.defer(function() {
                    Ext.callback(callback, scope, [operation]);
                }, 10);
            }
        );
    }
});
