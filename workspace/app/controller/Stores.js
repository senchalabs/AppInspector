Ext.define('AI.controller.Stores', {
    extend : 'Ext.app.Controller',

    requires : [
        'AI.store.Stores'
    ],

    init : function () {
        this.control({
            'ai-view-storeinspector' : {
                'activate' : this.onStoreGridActivate
            }
        });
    },

    onStoreGridActivate : function (view, eOpts) {
        var newStore = Ext.create('AI.store.Stores', {}),
            grid = view.down('gridpanel');

        grid.reconfigure(newStore);

        var getStoresFromInspectedWindow = function () {
            if (!window.Ext) {
                alert('No Ext');
                return null;
            }

            var stores = [];

            Ext.each(Ext.StoreManager.items, function (store) {
                stores.push({
                    id    : store.storeId,
                    count : store.getCount()
                });
            });

            return stores;
        };

        chrome.devtools.inspectedWindow.eval(
            '(' + getStoresFromInspectedWindow + ')()',
            function (stores, isException) {
                if (isException) {
                    AI.util.parseException(isException);
                    return;
                }

                Ext.each(stores, function (store) {
                    var model = Ext.create('AI.model.Store', store);

                    newStore.add(model);
                });
            }
        );
    }
});