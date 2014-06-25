/**
 *
 */
Ext.define('AI.view.stores.StoresListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.storeslist',

    requires: [
        'AI.util.InspectedWindow',
        'AI.util.Store'
    ],

    /**
     *
     */
    onActivate: function(grid) {
        // load the "Components" upfront ...
        var initialLoad = grid.getInitialLoad();

        if (!initialLoad && grid) {
            // ... but only once
            grid.setInitialLoad(true);

            this.onStoreGridActivate(grid);
        }
    },

    /**
     *
     */
    onStoreGridActivate: function(grid) {
        var gridstore = this.getStore('Stores');

        gridstore.removeAll();

        grid.setLoading('Loading stores...');

        AI.util.InspectedWindow.eval(
            AI.util.Store.getStores,
            null,
            function(stores) {
                Ext.each(stores, function(store) {
                    gridstore.add(store);
                });

                grid.setLoading(false);
            }
        );
    },

    /**
     *
     */
    onRefreshClick: function(btn) {
        var view = btn.up('storeslist'),
            filter = view.down('filterfield');

        filter.reset();
        this.onStoreGridActivate(view);
    },

    /**
     *
     */
    onSelect: function(selModel, record, item, index, e, eOpts) {
        var me = this,
            parent = me.getView().up('stores'),
            card = parent.down('#records'),
            layout = card.getLayout(),
            details = parent.down('#recorddetails'),
            detailsstore = details.getStore(),
            isTree = record.get('isTree'),
            // "normal" store records list
            recordslist = card.down('#recordslist'),
            // tree store records list
            recordslisttree = card.down('#recordslisttree');

        // delegate to the accociated view
        if (isTree) {
            recordslisttree.fireEvent('loadtreerecords', recordslisttree, record);
        } else {
            recordslist.fireEvent('loadrecords', recordslist, record);
        }

        // clear record details
        detailsstore.removeAll();

        // show it
        layout.setActiveItem(
            (isTree ? recordslisttree : recordslist)
        );
    }
});
