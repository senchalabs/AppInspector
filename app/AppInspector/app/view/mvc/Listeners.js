/**
 * @class   AI.view.mvc.Listeners
 * @extends Ext.grid.Panel
 */
Ext.define('AI.view.mvc.Listeners', {
    extend : 'Ext.grid.Panel',
    alias  : 'widget.mvc_listeners',

    requires : [
        'Ext.grid.column.Column',
        'Ext.grid.View',
        'Ext.grid.feature.Grouping'
    ],

    title : 'Controller Listeners',
    store : 'mvc.Listeners',

    columns  : [
        {
            xtype     : 'gridcolumn',
            dataIndex : 'event',
            text      : 'Event Name',
            flex      : 1
        },
        {
            xtype     : 'gridcolumn',
            dataIndex : 'selector',
            text      : 'Selector',
            flex      : 1
        },
        {
            xtype     : 'gridcolumn',
            dataIndex : 'method',
            text      : 'Method Name',
            flex      : 1
        }
    ],
    features : [
        {
            ftype : 'grouping'
        }
    ]

});
