/**
 * @class   AI.view.stores.recorddetails.RecordDetails
 * @extends Ext.grid.Panel
 */
Ext.define('AI.view.stores.recorddetails.RecordDetails', {
    extend: 'Ext.grid.Panel',
    xtype : 'recorddetails',

    requires: [
        'Ext.grid.View',
        'Ext.grid.Column'
    ],

    controller: 'recorddetails',
    viewModel : {
        type: 'recorddetails'
    },
    bind      : {
        store: '{RecordDetails}'
    },

    title      : 'Record Details',
    cls        : 'highlight',
    columnLines: false,
    hideHeaders: true,
    rowLines   : true,

    viewConfig: {
        markDirty : false,
        stripeRows: true
    },
    columns   : [
        {
            xtype    : 'gridcolumn',
            dataIndex: 'text',
            text     : 'Name',
            flex     : 2
        },
        {
            xtype    : 'gridcolumn',
            /**
             * @param {Object}          value
             * @param {Object}          metaData
             * @param {Ext.data.Model}  record
             *
             * @returns {String}
             */
            renderer : function (value, metaData, record) {
                var v = value;

                if (value === null) {
                    v = 'null';
                }

                if (record.data.text === 'undefined') {
                    v = 'undefined';
                }

                return '<span class="highlight ' + record.get('type') + ' ' + v + '">' + v + '</span>';
            },
            dataIndex: 'value',
            text     : 'Value',
            flex     : 3
        }
    ],

    listeners: {
        showdetails: 'showDetails',
        scope      : 'controller'
    }
});
