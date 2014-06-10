Ext.define('AI.view.components.ComponentBindings', {
    extend : 'Ext.grid.Panel',
    xtype  : 'ai-components-bindings',

    requires : [
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.column.Boolean',
        'Ext.grid.View'
    ],

    cls      : 'highlight',
    disabled : true,
    itemId   : 'ComponentBindings',
    title    : 'MVVM Bindings',
    store    : 'ComponentBindings',

    viewConfig : {
        getRowClass : function (record, rowIndex, rowParams, store) {
            var cls = [];

            if (!record.get('isValid')) {
                cls.push('isInvalidBinding');
            }

            return cls.join(' ');
        }
    },

    columns : [
        {
            xtype        : 'booleancolumn',
            dataIndex    : 'isValid',
            width        : 5,
            resizable    : false,
            defaultWidth : 5,
            sortable     : false,
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
            dataIndex : 'key',
            text      : 'Binding Key',
            flex      : 1
        },
        {
            xtype     : 'gridcolumn',
            dataIndex : 'value',
            text      : 'Value',
            flex      : 1
        },
        {
            xtype     : 'gridcolumn',
            dataIndex : 'boundTo',
            text      : 'Bound To',
            flex      : 1
        }
    ]

});