Ext.define('AI.view.components.ComponentsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.components',

    data: {
        componentstree: {
            selected: false,
            isMVVM: false
        },
        componentsdetails: {
            properties: false,
            methods: false,
            bindings: false
        }
    }
});
