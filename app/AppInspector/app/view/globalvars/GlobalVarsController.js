/**
 * @class   AI.view.globalvars.GlobalVarsController
 * @extends Ext.app.ViewController
 */
Ext.define('AI.view.globalvars.GlobalVarsController', {
    extend: 'Ext.app.ViewController',
    alias : 'controller.globalvars',

    require: [
        'AI.util.InspectedWindow'
    ],

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
            win = view.getInitialLoadWindow(),
            filter = view.down('filterfield');

        if (win && btn.action === 'initial') {
            view.getEl().unmask();
            win.close();
        }

        filter.reset();

        AI.util.InspectedWindow.eval(
            me.analyze,
            [me.getExcluds().join(':::')],
            Ext.Function.bind(function (result, isException, view) {
                if (isException) {
                    AI.util.Error.parseException(isException);
                    return;
                }

                var src = result ? Ext.decode(result) : {};

                view.setSource(src);
            }, me, [view], true)
        );
    },

    /**
     * @private
     *
     * @returns {Object}
     *
     * @see     https://github.com/kangax/detect-global
     */
    analyze: function (exclude) {
        var global = (function () {
                return this;
            })(),
            getGlobalProps = function (object) {
                var props = {};

                for (var prop in object) {
                    props[prop] = {
                        type : typeof object[prop],
                        value: object[prop]
                    };
                }

                return props;
            },
            globalProps = getGlobalProps(global),
            iframe = document.getElementById('globalvarleaks'),
            cleanWindow,
            clean,
            prop,
            instance = (Ext.app && Ext.app.Application && Ext.app.Application.instance),
            excludes = exclude ? exclude.split(':::') : [],
            src = {};

        if (!iframe) {
            iframe = document.createElement('iframe');

            iframe.id = 'globalvarleaks';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            iframe.src = 'about:blank';
        }

        cleanWindow = iframe.contentWindow;

        if (instance) {
            excludes.push(instance.getName ? instance.getName() : instance.name);
        }

        for (clean in cleanWindow) {
            if (globalProps[clean]) {
                delete globalProps[clean];
            }
        }

        for (prop in globalProps) {
            if (excludes.indexOf(prop) > -1) {
                delete globalProps[prop];
            }
        }

        Ext.Object.each(globalProps, function (key, val) {
            var value = val.value;

            src[key] = value;

            if (Ext.isFunction(value)) {
                src[key] = key + '()';
            } else if (Ext.isBoolean(value) || Ext.isString(value) || Ext.isNumber(value)) {
                src[key] = value;
            } else {
                src[key] = '[object]';
            }
        });

        return Ext.encode(src);
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
                'Ext', '__commandLineAPI',
                (instance.getName ? instance.getName() : instance.name)
            ];

        // add app excludes
        // these namespaces were gathered during AI.util.InspectedWindow.getAppDetails()
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
    },

    /**
     * cancel edit to reset original value
     *
     * @returns {Boolean}
     */
    onValueEdit: function () {
        return false;
    }
});
