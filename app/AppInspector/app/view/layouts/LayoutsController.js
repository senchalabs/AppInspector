/**
 *
 */
Ext.define('AI.view.layouts.LayoutsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.layouts',

    /**
     *
     */
    onLayoutSelect: function(record) {
        AI.util.InspectedWindow.eval(
            AI.util.InspectedWindow.highlight,
            record.get('cmpId'),
            Ext.emptyFn
        );
    }
});
