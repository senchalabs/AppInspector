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

    store: {
        components: {
            type: 'tree',
            storeId: 'componentstree',
            model: 'AI.model.components.Component',
            proxy: {
                type: 'memory'
            },
            root: {
                text: '_COMPONENTS_',
                expanded: true,
                children: []
            }
        }

    }
});
