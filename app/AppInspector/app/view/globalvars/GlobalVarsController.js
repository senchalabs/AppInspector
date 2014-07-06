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
            win = view.getInitialLoadWindow(),
            src;

        if (win && btn.action === 'initial') {
            view.getEl().unmask();
            win.close();
        }

        filter.reset();

        // get global vars and display
        src = me.analyze();
        view.setSource(src);
    },

    /**
     * @private
     *
     * @returns {Object}
     */
    analyze: function () {
        var me = this,
            global = (function () {
                return this;
            })(),
            // globalvarcheck is the hidden iframe's id so we grab it
            cleanWindow = Ext.getDom('globalvarcheck').contentWindow,
            globalProps = me.getPropertyDescriptors(global),
            excludes = me.getExcluds(),
            prop;

        // exclude default globals
        for (prop in cleanWindow) {
            if (globalProps[prop]) {
                delete globalProps[prop];
            }
        }

        // exclude app globals
        for (prop in globalProps) {
            if (Ext.Array.contains(excludes, prop)) {
                delete globalProps[prop];
            }
        }

        return globalProps;
    },

    /**
     * @private
     *
     * @param   {Object}    object
     *
     * @returns {Object}
     */
    getPropertyDescriptors: function (object) {
        var props = {},
            prop;

        for (prop in object) {
            props[prop] = {
                type : typeof object[prop],
                value: object[prop]
            };
        }

        return props;
    },

    /**
     * @private
     *
     * @returns {String[]}
     */
    getExcluds: function () {
        var items = this.getView().up('main').down('about propertygrid').getStore().getData().items,
            instance = (Ext.app && Ext.app.Application && Ext.app.Application.instance),
            excludes = [
                'Ext',
                (instance.getName ? instance.getName() : instance.name)
            ];

        Ext.each(items, function (item) {
            excludes.push(item.data.name);
        });

        return excludes;
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
