/**
 * @class   AI.view.mvc.MVCController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.mvc.MVCController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.mvc',

    mixins: [
        'AI.mixin.Localize'
    ],

    /**
     * preload the mvc tree by delegating it to {AI.view.mvc.tree.Tree}
     *
     * @param {AI.view.components.Components}   panel
     *
     * @fire  activate
     */
    onActivate: function (panel) {
        var tree = panel.down('treepanel');

        tree.fireEvent('activate', tree, panel);
    }
});
