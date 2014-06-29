Ext.define('AI.view.components.ComponentsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.components',

    formulas: {
        isPropertiesTip: function (get) {
            return get('currentTab') === 'properties';
        },
        isMethodsTip: function (get) {
            return get('currentTab') === 'methods';
        },
        isPropertiesOrMethodsTip: function (get) {
            return get('currentTab') === 'properties' || get('currentTab') === 'methods';
        },
        isBindingsTip: function (get) {
            return get('currentTab') === 'bindings';
        },
        isViewModelTip: function (get) {
            return get('currentTab') === 'viewmodeldata';
        },
        isViewControllerTip: function (get) {
            return get('currentTab') === 'viewcontrollerdata';
        },
        isInheritanceModelTip: function (get) {
            return get('currentTab') === 'inheritancemodel';
        }
    },

    data: {
        selection: false,
        currentTab: 'properties',
        tabs: {
            properties: false,
            methods: false,
            bindings: false,
            viewmodeldata: false,
            viewcontrollerdata: false,
            inheritancemodel: false
        }
    }
});
