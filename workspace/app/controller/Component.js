Ext.define('AI.controller.Component', {
    extend : 'Ext.app.Controller',

    requires : [
        'AI.store.Components',
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json',
        'AI.model.Component',
        'AI.util.Component'
    ],

    init : function () {
        this.control({
            'ai-view-component-tree' : {
                'activate' : this.onComponentTreeActivate,
                'select'   : this.onSelectComponent
            },

            'button#RefreshComponentTree' : {
                click : this.onRefreshComponentsClick
            }
        });
    },

    onRefreshComponentsClick : function (btn) {
        var tree = btn.up('ai-view-component-tree');

        this.onComponentTreeActivate(tree);
    },

    onComponentTreeActivate : function (tree) {
        var nodes = [],
            root = tree.getRootNode();

        tree.setLoading('Loading components...');
        root.removeAll();

        AI.util.InspectedWindow.eval(
            AI.util.Component.loadComponentTree,
            null,
            function (components, isException) {
                Ext.each(components, function (cmp) {
                    var model = Ext.create('AI.model.Component', cmp);

                    nodes.push(model);
                });

                Ext.each(nodes, function (node) {
                    root.appendChild(node);
                });

                tree.setLoading(false);
            }
        );
    },

    onSelectComponent : function (selModel, record, index, eOpts) {
        AI.util.InspectedWindow.eval(
            AI.util.InspectedWindow.highlight,
            record.get('cmpId'),
            Ext.emptyFn
        );
    }
});