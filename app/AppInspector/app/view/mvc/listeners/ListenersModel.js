/**
 * @class   AI.view.mvc.listeners.ListenersModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.mvc.listeners.ListenersModel', {
    extend: 'Ext.app.ViewModel',
    alias : 'viewmodel.mvclisteners',

    requires: [
        'Ext.util.Sorter',
        'Ext.data.proxy.Memory'
    ],

    stores: {
        Listeners: {
            storeId   : 'Listeners',
            fields    : ['domain', 'selector', 'event', 'method'],
            sorters   : 'event',
            groupField: 'domain',
            proxy     : {
                type: 'memory'
            }
        }
    }
});
