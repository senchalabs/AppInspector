/**
 * @class   AI.view.components.ComponentsController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.components.ComponentsController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.components',

    mixins: [
        'AI.mixin.Localize'
    ],

    /**
     * @param {AI.view.components.Components}   panel
     *
     * @fire  activate
     *
     * preload the componets tree by delegating it to {AI.view.components.tree.Tree}
     */
    onActivate: function (panel) {
        var tree = panel.down('treepanel');

        tree.fireEvent('activate', tree, panel);
    },

    /**
     * @param {AI.view.components.*}    ct
     *
     * toggle components details tooltp visibility
     */
    toggleDetailsTips: function (ct) {
        var vm = ct.up('components').getViewModel();

        vm.set('currentTab', ct.xtype);
    },

    /**
     * @param  {AI.view.field.Filter}   field
     * @param  {String}                 value
     */
    onFilterComponentDetails: function (field, value) {
        var grid = field.up('gridpanel'),
            store = grid.getStore();

        store.clearFilter();

        if (value !== '') {
            store.filter([
                {
                    anyMatch     : true,
                    caseSensitive: false,
                    property     : 'name',
                    value        : value
                }
            ]);
        }
    },

    /**
     * cancel edit to reset original value
     */
    onDetailValueEdit: function () {
        return false;
    }
});
