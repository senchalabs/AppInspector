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
     * @param {AI.view.components.Components}   panel
     *
     * @fire  activate
     *
     * preload the mvc tree by delegating it to {AI.view.mvc.tree.Tree}
     */
    onActivate: function (panel) {
        var tree = panel.down('treepanel');

        tree.fireEvent('activate', tree, panel);
    }
});
