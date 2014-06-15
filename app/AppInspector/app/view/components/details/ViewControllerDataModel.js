/**
 * @class   AI.view.componets.details.ViewControllerDataModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.componets.details.ViewControllerDataModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.viewcontrollerdata',

    requires: [
        'Ext.data.Field',
        'Ext.util.Sorter'
    ],

    stores: {
        viewcontrollerdata: {
            type: 'tree',
            storeId: 'viewcontrollerDetails',
            fields: [
                'text', 'leaf'
            ],
            root: {
                text: '_VIEWCONTROLLER_',
                expanded: true,
                value: '',
                cls: 'root',
                iconCls: 'no-icon',
                children: []
            }
        }
    }
});
