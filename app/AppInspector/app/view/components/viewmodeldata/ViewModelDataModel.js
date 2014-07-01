/**
 * @class   AI.view.componets.details.ViewModelDataModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.componets.details.viewmodeldata.ViewModelDataModel', {
    extend: 'Ext.app.ViewModel',
    alias : 'viewmodel.viewmodeldata',

    requires: [
        'Ext.data.Field',
        'Ext.data.proxy.Memory',
        'Ext.util.Sorter'
    ],

    stores: {
        ViewModels: {
            type       : 'tree',
            storeId    : 'ViewModels',
            fields     : ['text', 'value'],
            rootVisible: true,
            root       : {
                expanded: true,
                children: []
            },
            proxy      : {
                type: 'memory'
            },
            sorters    : 'text'
        }
    }
});
