/**
 * @class   AI.view.components.properties.Properties
 * @extends Ext.grid.Panel
 */
Ext.define('AI.view.components.properties.Properties', {
    extend: 'Ext.grid.Panel',
    xtype : 'properties',

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

    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {})
    ],

    title : 'Properties',
    cls   : 'highlight',
    itemId: 'properties',

    viewModel: {
        type: 'properties'
    },
    bind     : {
        store: '{Properties}'
    },

    viewConfig: {
        markDirty  : false,
        stripeRows : true,
        /**
         * @param   {Ext.data.Model}    record
         *
         * @returns {String}
         */
        getRowClass: function (record) {
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
    columns   : {
        defaults: {
            sortable    : true,
            menuDisabled: true,
            draggable   : false
        },
        items   : [
            {
                xtype       : 'booleancolumn',
                width       : 5,
                resizable   : false,
                defaultWidth: 5,
                sortable    : false,
                dataIndex   : 'isOwn',
                groupable   : false,
                hideable    : false,
                lockable    : false,
                tdCls       : 'indicator',
                falseText   : ' ',
                trueText    : ' '
            },
            {
                xtype    : 'gridcolumn',
                dataIndex: 'name',
                text     : 'Name',
                flex     : 3
            },
            {
                xtype    : 'gridcolumn',
                dataIndex: 'value',
                text     : 'Value',
                flex     : 2,
                editor   : {
                    xtype        : 'textfield',
                    selectOnFocus: true
                }
            }
        ]
    },

    dockedItems: [
        {
            xtype : 'toolbar',
            dock  : 'top',
            border: 1,
            cls   : 'components-toolbar top',
            items : [
                {
                    xtype: 'tbfill'
                },
                {
                    xtype     : 'filterfield',
                    forceEnter: false,  // we can do this on {Ext.data.Store}
                    listeners : {
                        applyfilter: 'onFilterComponentDetails'
                    }
                }
            ]
        }
    ]
});
