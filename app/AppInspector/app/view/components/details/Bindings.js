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
        'Ext.grid.column.Column',
        'Ext.grid.column.Boolean',
        'Ext.grid.column.Template',
        'AI.view.field.Filter'
    ],

    title: 'MVVM Bindings',
    cls: 'highlight',
    itemId: 'bindings',

    // controller: 'methods',
    viewModel: {
        type: 'bindings'
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
            xtype: 'templatecolumn',
            dataIndex: 'boundTo',
            text: 'Bound To',
            flex: 1,
            tpl: '\{{boundTo}\}'
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'value',
            text: 'Value',
            flex: 1,
            renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                var v = value;

                if (value === null) {
                    v = 'null';
                }

                if (record.data.text === 'undefined') {
                    v = 'undefined';
                }

                return '<span class="' + record.get('type') + ' ' + v + '">' + v + '</span>';
            }
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
                // applyfilter: 'onFilterComponentDetails'
            }
        }]
    }]
});
