Ext.define('AI.view.components.ComponentsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.components',

    data: {
        componentstree: {
            selection: false
        },
        componentsdetails: {
            // tabs
            properties: false,
            methods: false,
            bindings: false,
            viewmodeldata: false,
            viewcontrollerdata: false
        }
    }
});
