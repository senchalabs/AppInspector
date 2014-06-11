/**
 *
 */
Ext.define('AI.view.components.details.Bindings', {
    extend: 'Ext.grid.Panel',
    xtype: 'bindings',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',
        'Ext.grid.View',
        'Ext.grid.column.Boolean',
        'AI.view.field.Filter'
    ],

    title: 'MVVM Bindings',
    cls: 'highlight',
    itemId: 'bindings',

    // controller: 'methods',
    viewModel: {
        type: 'details'
    },
    bind: {
        store: '{bindingsstore}'
    },

    viewConfig: {
        getRowClass: function(record, rowIndex, rowParams, store) {
            var cls = [];

            if (!record.get('isValid')) {
                cls.push('isInvalidBinding');
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
            dataIndex: 'key',
            text: 'Binding Key',
            flex: 1
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'value',
            text: 'Value',
            flex: 1
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'boundTo',
            text: 'Bound To',
            flex: 1
        }]
    }
});
