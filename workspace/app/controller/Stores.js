Ext.define('AI.controller.Stores', {
    extend : 'Ext.app.Controller',

    requires : [
        'AI.store.Stores',
        'AI.util.Store'
    ],

    init : function () {
        this.control({
            'ai-view-store-list' : {
                'activate' : this.onStoreGridActivate
            },

            'gridpanel#StoreList' : {
                'select'   : this.onStoreGridSelection
            },

            'gridpanel#RecordList' : {
                'select'   : this.onRecordGridSelection
            },

            'button#RefreshStores' : {
                click : this.onRefreshStoresClick
            }
        });
    },

    onRefreshStoresClick : function(btn) {
        var view = btn.up('ai-view-store-list');

        this.onStoreGridActivate(view);
    },

    onStoreGridActivate : function (view, eOpts) {
        var newStore = Ext.create('AI.store.Stores', {}),
            grid = view.down('#StoreList');

        grid.reconfigure(newStore);
        grid.setLoading('Loading stores...');

        AI.util.InspectedWindow.eval(
            AI.util.Store.getStores,
            null,
            function (stores) {
                Ext.each(stores, function (store) {
                    var model = Ext.create('AI.model.Store', store);

                    newStore.add(model);
                });

                grid.setLoading(false);
            }
        );
    },

    onStoreGridSelection : function(selModel, record, index, eOpts) {
        var newStore = Ext.create('AI.store.Records', {}),
            parent = Ext.ComponentQuery.query('ai-view-store-records')[0],
            grid = parent.down('#RecordList'),
            propertyGrid = parent.down('#RecordDetail');

        grid.reconfigure(newStore);
        propertyGrid.setSource({});

        grid.setLoading('Loading records...');

        AI.util.InspectedWindow.eval(
            AI.util.Store.getRecords,
            record.get('id'),
            function (records, isException) {
                Ext.each(records, function (record) {
                    var model = Ext.create('AI.model.Record', record);

                    newStore.add(model);
                });

                grid.setLoading(false);
            }
        );
    },

    onRecordGridSelection : function(selModel, record, index, eOpts) {
        var parent = Ext.ComponentQuery.query('ai-view-store-records')[0],
            propertyGrid = parent.down('#RecordDetail');

        propertyGrid.setSource(record.raw.modelData);
    }
});