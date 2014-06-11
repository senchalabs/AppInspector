/**
 * @class   AI.view.components.ComponentsController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.components.ComponentsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.components',

    /**
     * preload the componets tree by delegating it to {AI.view.components.tree.Tree}
     *
     * @param {AI.view.components.Components}   panel
     *
     * @fire  cmpactivate
     */
    onActivate: function(panel) {
        var tree = panel.down('treepanel');

        tree.fireEvent('cmpactivate', tree, panel);
    },

    /**
     * toggle components details tooltp visibility
     *
     * @param {AI.view.components.details.Properties|AI.view.components.details.Methods}    ct
     */
    toggleDetailsTips: function(ct) {
        var vm = ct.up('components').getViewModel();

        vm.set('componentsdetails.properties', ct.xtype === 'properties');
        vm.set('componentsdetails.methods', ct.xtype === 'methods');
        vm.set('componentsdetails.isPropertiesOrMethods', (ct.xtype === 'properties' || ct.xtype === 'methods'));
        vm.set('componentsdetails.bindings', ct.xtype === 'bindings');
        vm.set('componentsdetails.viewmodeldata', ct.xtype === 'viewmodeldata');
    },

    /**
     * @param  {AI.view.field.Filter}   field
     * @param  {String}                 value
     */
    onFilterComponentDetails: function(field, value) {
        var grid = field.up('gridpanel'),
            store = grid.getStore();

        store.clearFilter();

        if (value !== '') {
            store.filter([{
                anyMatch: true,
                caseSensitive: false,
                property: 'name',
                value: value
            }]);
        }
    },

    /**
     * cancel edit to reset original value
     */
    onDetailValueEdit: function() {
        return false;
    },

    /**
     * localize
     */
    localize: function() {
        var view = this.getView(),
            msg = AI.util.i18n.getMessage;

        view.setTitle(msg(view.title));
    }
});
