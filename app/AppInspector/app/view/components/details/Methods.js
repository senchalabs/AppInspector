/**
 * @class   AI.view.components.details.Methods
 * @extends Ext.grid.Panel
 */
Ext.define('AI.view.components.details.Methods', {
    extend: 'Ext.grid.Panel',
    xtype: 'methods',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',
        'Ext.grid.View',
        'Ext.grid.column.Column',
        'Ext.grid.column.Boolean',
        'AI.view.field.Filter'
    ],

    title: 'Methods',
    cls: 'highlight',
    itemId: 'methods',

    // controller: 'methods',
    viewModel: {
        type: 'details'
    },
    bind: {
        store: '{methodstore}'
    },

    viewConfig: {
        getRowClass: function(record, rowIndex, rowParams, store) {
            var cls = [];

            if (record.get('isOverride')) {
                cls.push('isOverride');
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
            flex: 2
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'value',
            text: 'Value',
            flex: 1
        }]
    },

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        border: 1,
        cls: 'components-toolbar top',
        items: ['->', {
            xtype: 'filterfield',
            listeners: {
                applyfilter: 'onFilterComponentDetails'
            }
        }]
    }]
});
