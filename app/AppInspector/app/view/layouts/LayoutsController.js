/**
 * @class   AI.view.layouts.LayoutsController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.layouts.LayoutsController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.layouts',

    mixins: [
        'AI.mixin.Localize'
    ],

    /**
     * @param   {Ext.data.Model}    record
     */
    onLayoutSelect: function (record) {
        AI.util.InspectedWindow.eval(
            AI.util.InspectedWindow.highlight,
            record.get('cmpId'),
            Ext.emptyFn
        );
    }
});
