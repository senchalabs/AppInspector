/**
 * @class   AI.view.globalvars.GlobalVars
 * @extends Ext.grid.property.Grid
 */
Ext.define('AI.view.globalvars.GlobalVars', {
    extend: 'Ext.grid.property.Grid',
    xtype : 'globalvars',

    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.toolbar.Fill',
        'AI.view.field.Filter'
    ],

    config: {
        /**
         * @private
         * @cfg     {Ext.window.Window} [initialLoadWindow]
         */
        initialLoadWindow: null
    },

    controller: 'globalvars',

    title          : 'Globals',
    glyph          : 'xf0ac@fontawesome',
    cls            : 'highlight',
    nameColumnWidth: '50%',
    source         : {},
    emptyText      : [
        '<strong>Good!</strong>',
        'No leaking global <span style="font-family: monospace">var</span> detected...'
    ].join('<br/>'),

    dockedItems: [
        {
            xtype: 'toolbar',
            dock : 'top',
            items: [
                {
                    xtype  : 'button',
                    text   : 'Refresh',
                    action : 'refresh',
                    glyph  : 'xf021@fontawesome',
                    handler: 'onRefreshClick'
                },
                {
                    xtype: 'tbfill'
                },
                {
                    xtype     : 'filterfield',
                    forceEnter: false,  // we can do this on {Ext.grid.property.Store}
                    listeners : {
                        applyfilter: 'onFilterVars'
                    }
                }
            ]
        }
    ],

    listeners: {
        activate: {
            fn    : 'onActivate',
            single: true
        },
        scope   : 'controller'
    },

    /**
     * @override
     * @param   {Object}    source
     */
    setSource: function (source) {
        var me = this,
            renderer = me.valueRenderer,
            src = {},
            config = {};

        Ext.Object.each(source, function (key, val) {
            var value = val.value,
                type = (typeof value);

            src[key] = value;

            if (Ext.isObject(value)) {
                type = 'string';
                src[key] = '[object]';
            }

            if (Ext.isFunction(value)) {
                type = 'string';
                src[key] = key + '()';
            }

            config[key] = {
                editor  : null,
                type    : type,
                renderer: renderer
            };
        });

        me.callParent([src, config]);
    }
});
