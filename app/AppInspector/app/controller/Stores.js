/**
 * @class   AI.controller.Stores
 * @extends Ext.app.Controller
 */
Ext.define('AI.controller.Stores', {
    extend : 'Ext.app.Controller',

    requires : [
        'AI.util.InspectedWindow',
        'AI.util.Store',
        'AI.util.TreeStore'
    ],

    models : [
        'Record',
        'stores.Store',
        'stores.RecordDetail'
    ],
    stores : [
        'Records',
        'stores.Stores',
        'stores.RecordsTree',
        'stores.RecordDetails'
    ],
    views  : [
        'stores.Stores',
        'stores.RecordList',
        'stores.RecordListTree',
        'stores.RecordDetails'
    ],

    init : function (application) {
        var me = this;

        me.control({
            'panel#StoreInspector'          : {
                'activate' : me.onActivate
            },
            'button#RefreshStores'          : {
                'click' : me.onRefreshStoresClick
            },
            'filterfield#FilterStoresList'  : {
                'applyfilter' : me.onFilterStores
            },
            'gridpanel#StoreList'           : {
                'itemclick' : me.onStoreGridSelection
            },

            //TODO: create separate handlers, because the Grid and Tree will behave differently
            'gridpanel#RecordListStore'     : {
                'itemclick' : me.onRecordGridSelection
            },
            'treepanel#RecordListTreeStore' : {
                'itemclick' : me.onRecordGridSelection
            }
        });
    },

    onActivate : function (panel) {
        // load the "Stores" upfront
        var initialLoad = panel.initialLoad,
            grid = panel.down('gridpanel#StoreList');

        if (!initialLoad && grid) {
            // ... but only once
            panel.initialLoad = true;

            this.onStoreGridActivate(panel);
        }
    },

    onStoreGridActivate : function (panel) {
        var grid = panel.down('#StoreList'),
            gridStore = grid.getStore();

        gridStore.removeAll();

        grid.setLoading('Loading stores...');

        AI.util.InspectedWindow.eval(
            AI.util.Store.getStores,
            null,
            function (stores) {
                Ext.each(stores, function (store) {
                    var model = Ext.create('AI.model.stores.Store', store);

                    gridStore.add(model);
                });

                grid.setLoading(false);
            }
        );
    },

    onRefreshStoresClick : function (btn) {
        var view = btn.up('#StoreInspector'),
            filter = view.down('#FilterStoresList');

        filter.reset();
        this.onStoreGridActivate(view);
    },

    onFilterStores : function (field, value) {
        var grid = field.up('#StoreList'),
            store = grid.getStore();

        store.clearFilter();

        if (value !== '') {
            store.filter([
                {
                    anyMatch      : true,
                    caseSensitive : false,
                    property      : 'id',
                    value         : value
                }
            ]);
        }
    },

    onStoreGridSelection : function (storeGrid, record, item, index, e, eOpts) {
        var parent = Ext.ComponentQuery.query('#StoreDetails')[0],
            card = parent.down('#StoreRecordsContainer'),
            layout = card.getLayout(),
            isTreeStore = record.get('isTree'),
        // records list store
            recordsGrid,
            recordsGridStore,
        // records list treestore
            recordsTree,
            recordsTreeStore,
            recordsRoot,
        // record details
            detailsTree = parent.down('#RecordDetail'),
            detailsRoot = detailsTree.getRootNode();

        if (!isTreeStore) {
            // records list store
            recordsGrid = parent.down('#RecordListStore');
            recordsGridStore = recordsGrid.getStore();

            recordsGridStore.removeAll();

            recordsGridStore.getProxy().inspectedStoreId = record.get('id');

            recordsGridStore.load({
                callback : function (records, operation, success) {
                    record.set('count', this.getTotalCount());
                }
            });

            layout.setActiveItem(recordsGrid);
        }
        else {
            // records list treestore
            recordsTree = parent.down('#RecordListTreeStore');
            recordsTreeStore = recordsTree.getStore();
            recordsRoot = recordsTree.getRootNode();

            AI.util.InspectedWindow.eval(
                AI.util.TreeStore.getChildNodes,

                // storeId
                [record.get('id')],

                function (result) {
                    recordsRoot.removeAll();

                    recordsRoot.appendChild(result);
                    recordsRoot.expandChildren();

                    layout.setActiveItem(recordsTree);
                }
            );
        }

        // record details
        detailsRoot.removeAll();
        detailsRoot.set('value', record.get('model'));

    },

    onRecordGridSelection : function (dataview, record, item, index, e, eOpts) {
        var parent = Ext.ComponentQuery.query('#StoreDetails')[0],
            tree = parent.down('#RecordDetail'),
            root = tree.getRootNode(),
            details = Ext.JSON.decode(record.data.modelData);

        root.removeAll();

        Ext.Object.each(details, function (key, value) {
            root.appendChild(Ext.create('AI.model.stores.RecordDetail', {
                text    : key,
                value   : value,
                iconCls : 'no-icon',
                leaf    : true
            }));
        });

        //TODO: this is deprecated... do we still need it?
        //root.setDirty(false);
    }

});
