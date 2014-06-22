Ext.define('AI.view.components.ComponentsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.components',

    formulas: {
        propertiesTip: function(get) {
            return get('currentTab') === 'properties';
        },
        methodsTip: function(get) {
            return get('currentTab') === 'methods';
        },
        propertiesOrMethodsTip: function(get) {
            return get('currentTab') === 'properties' || get('currentTab') === 'methods';
        },
        bindingsTip: function(get) {
            return get('currentTab') === 'bindings';
        },
        vmTip: function(get) {
            return get('currentTab') === 'viewmodeldata';
        },
        vcTip: function(get) {
            return get('currentTab') === 'viewcontrollerdata';
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
            viewcontrollerdata: false
        }
    }
});
