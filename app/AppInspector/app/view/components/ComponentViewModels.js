Ext.define('AI.view.components.ComponentViewModels', {
    extend : 'Ext.grid.Panel',
    xtype  : 'ai-components-viewmodels',

    requires : [
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.column.Boolean',
        'Ext.grid.View'
    ]

});