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

    mixins: [
        'AI.mixin.Localize'
    ],

    title: 'Methods',
    cls: 'highlight',
    itemId: 'methods',

    // controller: 'methods',
    viewModel: {
        type: 'methods'
    },
    bind: {
        store: '{methodstore}'
    },

    viewConfig: {
        markDirty: false,
        stripeRows: true,
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
            flex: 1
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'value',
            text: 'Function',
            flex: 2,
            hidden: true
        }]
    },

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
