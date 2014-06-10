Ext.define('AI.view.components.ComponentProperties', {
    extend : 'Ext.grid.Panel',
    xtype  : 'ai-components-properties',

    requires : [
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.column.Boolean',
        'Ext.grid.View',
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',

        'AI.view.FilterField'
    ],

    cls         : 'highlight',
    itemId      : 'ComponentProps',
    title       : 'Properties',
    store       : 'ComponentProps',
    dockedItems : [
        {
            xtype  : 'toolbar',
            dock   : 'top',
            border : 1,
            cls    : 'components-toolbar top',
            items  : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'filterfield'
                }
            ]
        }
    ],
    viewConfig  : {
        getRowClass : function (record, rowIndex, rowParams, store) {
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
    columns     : [
        {
            xtype        : 'booleancolumn',
            width        : 5,
            resizable    : false,
            defaultWidth : 5,
            sortable     : false,
            dataIndex    : 'isOwn',
            groupable    : false,
            hideable     : false,
            lockable     : false,
            menuDisabled : true,
            tdCls        : 'indicator',
            falseText    : ' ',
            trueText     : ' '
        },
        {
            xtype     : 'gridcolumn',
            dataIndex : 'name',
            text      : 'Name',
            flex      : 2
        },
        {
            xtype     : 'gridcolumn',
            dataIndex : 'value',
            text      : 'Value',
            flex      : 1,
            editor    : {
                xtype         : 'textfield',
                selectOnFocus : true
            }
        }
    ],

    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ]
});