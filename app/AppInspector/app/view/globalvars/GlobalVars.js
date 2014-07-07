/**
 * @class   AI.view.globalvars.GlobalVars
 * @extends Ext.grid.property.Grid
 */
Ext.define('AI.view.globalvars.GlobalVars', {
    extend: 'Ext.grid.property.Grid',
    xtype : 'globalvars',

    requires: [
        'Ext.toolbar.Toolbar',
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
        validateedit: 'onValueEdit',
        scope   : 'controller'
    },

    /**
     * @override
     * @param   {Object}    source
     */
    setSource: function (source) {
        var me = this,
            renderer = me.valueRenderer,
            config = {};

        Ext.Object.each(source, function (key, val) {
            config[key] = {
                editor  : null,
                type    : (typeof val),
                renderer: renderer
            };
        });

        me.callParent([source, config]);
    }
});
