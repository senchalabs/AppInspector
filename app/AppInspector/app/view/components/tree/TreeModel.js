/**
 * @class   AI.view.components.tree.TreeModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.components.tree.TreeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.componentstree',

    requires: [
        'Ext.data.proxy.Memory',
        'AI.model.components.Component'
    ],

    stores: {
        Components: {
            type: 'tree',
            storeId: 'Components',
            model: 'AI.model.components.Component',
            proxy: {
                type: 'memory'
            },
            rootVisible: false,
            root: {
                text: '_COMPONENTS_',
                expanded: true,
                children: []
            }
        }

    }
});
