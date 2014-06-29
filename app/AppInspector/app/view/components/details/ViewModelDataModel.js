/**
 * @class   AI.view.componets.details.ViewModelDataModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.componets.details.ViewModelDataModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.viewmodeldata',

    requires: [
        'Ext.data.Field',
        'Ext.util.Sorter',
        'AI.model.components.Component'
    ],

    stores: {
        viewmodeldata: {
            type: 'tree',
            storeId: 'viewmodelDetails',
            model: 'AI.model.components.Component',
            // fields: [
            //     'text', 'value'
            // ],
            root: {
                text: '_VIEWMODEL_',
                expanded: true,
                value: '',
                cls: 'root',
                iconCls: 'no-icon',
                children: []
            },
            sorters: 'text'
        }
    }
});
