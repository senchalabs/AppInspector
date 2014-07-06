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
                    xtype    : 'filterfield',
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
    }
});
