/**
 *
 */
Ext.define('AI.view.stores.details.RecordDetails', {
    extend: 'Ext.grid.Panel',
    xtype: 'recorddetails',

    requires: [
        'Ext.grid.View',
        'Ext.grid.Column'
    ],

    // controller: 'recorddetails',
    // viewModel: {
    //     type: 'recorddetails'
    // },

    title: 'Record Details',
    cls: 'treegrid',
    columnLines: false,
    hideHeaders: true,
    rowLines: true,
    useArrows: true,

    viewConfig: {
        markDirty: false,
        stripeRows: true
    },
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'text',
        text: 'Name',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
            var v = value;

            if (value === null) {
                v = 'null';
            }

            if (record.data.text === 'undefined') {
                v = 'undefined';
            }

            return '<span class="' + record.get('type') + ' ' + v + '">' + v + '</span>';
        },
        dataIndex: 'value',
        text: 'Value',
        flex: 2
    }]
});
