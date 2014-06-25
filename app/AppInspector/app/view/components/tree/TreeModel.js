/**
 * @class   AI.view.components.tree.TreeModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.components.tree.TreeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.componentstree',

    requires: [
        'Ext.data.Field',
        'Ext.util.Sorter'
    ],

    stores: {
        Components: {
            type: 'tree',
            storeId: 'Components',
            fields: ['text', 'cmpId', 'itemId', 'xtype', 'children'],
            proxy: {
                type: 'memory'
            },
            rootVisible: false,
            root: {
                text: '_COMPONENTS_',
                expanded: true,
                children: []
            },
            sorters: 'text'
        }

    }
});
