/**
 * @class   AI.view.globalvars.GlobalVarsController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.globalvars.GlobalVarsController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.globalvars',

    /**
     * activate callback handler
     */
    onActivate: function () {
        var me = this,
            view = me.getView(),
            el = view.getEl(),
            window = view.getInitialLoadWindow();

        if (!window) {
            window = Ext.create('Ext.window.Window', {
                renderTo   : el,
                title      : 'Check your app for global <span style="font-family: monospace">var</span> leaks',
                width      : 300,
                buttons    : [
                    {
                        text   : 'check',
                        action : 'initial',
                        handler: me.onRefreshClick,
                        scope  : me
                    }
                ],
                closable   : false,
                collapsible: false,
                draggable  : false,
                maximizable: false,
                minimizable: false,
                modal      : true,
                resizable  : false
            });

            view.setInitialLoadWindow(window);
        }

        el.mask();
        window.show();
    },

    /**
     * @param   {Ext.button.Button} btn
     */
    onRefreshClick: function (btn) {
        var me = this,
            view = me.getView(),
            filter = view.down('filterfield'),
            window = view.getInitialLoadWindow();

        if (window && btn.action === 'initial') {
            view.getEl().unmask();
            window.close();
        }

        filter.reset();

        // <debug>
        view.setSource(Ext);
        // </debug>

        // TODO
    },

    /**
     * @param   {AI.view.field.Filter}  field
     * @param   {String}                value
     */
    onFilterVars: function (field, value) {
        var view = this.getView(),
            store = view.getStore(),
            re;

        store.clearFilter();

        if (value !== '') {
            re = new RegExp(value, 'i');

            store.filterBy(function (record) {
                return re.test(record.data.name);
            });
        }
    }
});
