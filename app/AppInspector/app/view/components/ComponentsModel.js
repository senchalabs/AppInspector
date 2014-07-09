/**
 * @class   AI.view.components.ComponentsModel
 * @extends Ext.app.ViewModel
 */
Ext.define('AI.view.components.ComponentsModel', {
    extend: 'Ext.app.ViewModel',
    alias : 'viewmodel.components',

    formulas: {
        /**
         * @param   {Function}  get
         *
         * @returns {Boolean}
         */
        isPropertiesTip         : function (get) {
            return get('currentTab') === 'properties';
        },
        /**
         * @param   {Function}  get
         *
         * @returns {Boolean}
         */
        isMethodsTip            : function (get) {
            return get('currentTab') === 'methods';
        },
        /**
         * @param   {Function}  get
         *
         * @returns {Boolean}
         */
        isPropertiesOrMethodsTip: function (get) {
            return get('currentTab') === 'properties' || get('currentTab') === 'methods';
        },
        /**
         * @param   {Function}  get
         *
         * @returns {Boolean}
         */
        isBindingsTip           : function (get) {
            return get('currentTab') === 'bindings';
        },
        /**
         * @param   {Function}  get
         *
         * @returns {Boolean}
         */
        isViewModelTip          : function (get) {
            return get('currentTab') === 'viewmodeldata';
        },
        /**
         * @param   {Function}  get
         *
         * @returns {Boolean}
         */
        isViewControllerTip     : function (get) {
            return get('currentTab') === 'viewcontrollerdata';
        },
        /**
         * @param   {Function}  get
         *
         * @returns {Boolean}
         */
        isInheritanceModelTip   : function (get) {
            return get('currentTab') === 'inheritancemodel';
        }
    },

    data: {
        currentTab: 'properties',
        tabs      : {
            properties        : false,
            methods           : false,
            bindings          : false,
            viewmodeldata     : false,
            viewcontrollerdata: false,
            inheritancemodel  : false
        }
    }
});
