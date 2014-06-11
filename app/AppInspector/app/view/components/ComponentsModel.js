Ext.define('AI.view.components.ComponentsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.components',

    data: {
        componentstree: {
            selected: false,
            isMVVMBindings: false,
            isViewModelData: false
        },
        componentsdetails: {
            // tabs
            properties: false,
            methods: false,
            bindings: false,
            viewmodeldata: false,
            // logical binding
            isPropertiesOrMethods: false
        }
    }
});
