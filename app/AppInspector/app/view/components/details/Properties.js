/**
 * @class   AI.view.components.details.Properties
 * @extends Ext.grid.Panel
 */
Ext.define('AI.view.components.details.Properties', {
    extend: 'Ext.grid.Panel',
    xtype: 'properties',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',
        'Ext.grid.View',
        'Ext.grid.column.Column',
        'Ext.grid.column.Boolean',
        'Ext.grid.plugin.CellEditing',
        'AI.view.field.Filter'
    ],

    mixins: [
        'AI.mixin.Localize'
    ],

    title: 'Properties',
    cls: 'highlight',
    itemId: 'properties',

    // controller: 'properties',
    viewModel: {
        type: 'properties'
    },
    bind: {
        store: '{propstore}'
    },

    viewConfig: {
        markDirty: false,
        stripeRows: true,
        getRowClass: function(record, rowIndex, rowParams, store) {
            var cls = [];

            if (record.get('isChanged')) {
                cls.push('isChanged');
            }

            if (record.get('isOwn')) {
                cls.push('isOwn');
            }

            return cls.join(' ');
        }
    },
    columns: {
        defaults: {
            sortable: true,
            menuDisabled: true,
            draggable: false
        },
        items: [{
            xtype: 'booleancolumn',
            width: 5,
            resizable: false,
            defaultWidth: 5,
            sortable: false,
            dataIndex: 'isOwn',
            groupable: false,
            hideable: false,
            lockable: false,
            tdCls: 'indicator',
            falseText: ' ',
            trueText: ' '
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'name',
            text: 'Name',
            flex: 3
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'value',
            text: 'Value',
            flex: 2,
            editor: {
                xtype: 'textfield',
                selectOnFocus: true
            }
        }]
    },

    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {})
    ],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        border: 1,
        cls: 'components-toolbar top',
        items: [{
            xtype: 'tbfill'
        }, {
            xtype: 'filterfield',
            listeners: {
                applyfilter: 'onFilterComponentDetails'
            }
        }]
    }]
});
