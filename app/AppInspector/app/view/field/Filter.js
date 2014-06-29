/**
 *
 */
Ext.define('AI.view.field.Filter', {
    extend: 'Ext.form.field.Text',
    xtype: 'filterfield',

    controller: 'filterfield',

    config: {
        forceEnter: true
    },

    maxWidth: 200,
    minWidth: 100,
    fieldLabel: 'Filter',
    hideLabel: true,
    name: 'filter',
    tabIndex: 1,
    emptyText: 'Filter',
    enableKeyEvents: true,
    selectOnFocus: true,
    // triggers        : {
    //     clear : {
    //         glyph   : 88,
    //         handler : function () {
    //             this.reset()
    //         }
    //     }
    // },

    listeners: {
        change: 'onFilterfieldChange',
        keypress: 'onFilterfieldKeypress',
        beforerender: 'onFilterfieldBeforeRender',
        scope: 'controller'
    }
});
