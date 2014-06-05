/**
 * @class   AI.controller.MVC
 * @extends Ext.app.Controller
 */
Ext.define('AI.controller.MVC', {
    extend : 'Ext.app.Controller',

    requires : [
        'AI.util.extjs.MVC',
        'AI.util.touch.MVC'
    ],

    models : [
        'mvc.Tree',
        'mvc.Listeners'
    ],
    stores : [
        'MVC',
        'mvc.Records',
        'mvc.Listeners'
    ],
    views  : [
        'MVC',
        'mvc.Records',
        'mvc.Listeners'
    ],

    init : function () {
        this.control({
            'mvc'                   : {
                activate : this.onActivate
            },
            'mvc treepanel'         : {
                select : this.onMVCSelect
            },
            'mvc_records gridpanel' : {
                itemclick : this.onRecordGridSelection
            }
        });
    },

    onActivate : function (component) {
        var tree = component.child('treepanel'),
            treeStore = tree.getStore(),
            fn;

        if (this.getApplication().info.framework === 'ext') {
            fn = AI.util.extjs.MVC.getApplication;
        }
        else {
            fn = AI.util.touch.MVC.getApplication;
        }

        AI.util.InspectedWindow.eval(
            fn,
            null,
            function (data) {
                treeStore.setRootNode({
                    expanded : true,
                    children : data
                });
            }
        );
    },

    onMVCSelect : function (rowmodel, record) {
        var type = record.get('type');

        if (type) {
            var view = rowmodel.view,
                panel = view.up('mvc'),
                children = panel.query('> component'),
                i = 1,
                length = children.length,
                grid, store;

            panel.suspendLayouts();

            for (; i < length; i++) {
                children[i].hide();
            }

            if (type === 'controller') {
                grid = panel.child('mvc_listeners');
                store = grid.getStore();

                grid.show();

                store.removeAll();
                store.add(record.get('eventbus'));
            }
            else if (type === 'store') {
                var cnt = panel.child('mvc_records'),
                    property = cnt.child('propertygrid');

                grid = cnt.child('gridpanel');
                store = grid.getStore();

                cnt.show();

                store.removeAll();
                property.setSource({});

                store.getProxy().inspectedStoreId = record.get('id');

                store.load({
                    callback : function () {
                        record.set('count', this.getTotalCount());
                    }
                });
            }

            panel.resumeLayouts(true);
        }
    },

    onRecordGridSelection : function (view, record) {
        var panel = view.up('gridpanel'),
            property = panel.nextSibling();

        property.setSource(Ext.JSON.decode(record.data.modelData));
    }

});
