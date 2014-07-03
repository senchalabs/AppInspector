/**
 * @class   AI.view.components.viewcontrollerdata.ViewControllerData
 * @extends Ext.tree.Panel
 */
Ext.define('AI.view.components.viewcontrollerdata.ViewControllerData', {
    extend: 'Ext.tree.Panel',
    xtype : 'viewcontrollerdata',

    requires: [
        'Ext.tree.View',
        'Ext.tree.Column'
    ],

    mixins: [
        'AI.mixin.Localize'
    ],

    title : 'MVVM ViewController',
    cls   : 'treegrid highlight',
    itemId: 'viewcontrollerdata',

    viewModel: {
        type: 'viewcontrollerdata'
    },
    bind     : {
        store: '{ViewControllers}'
    },

    config: {
        initialLoad: false
    },

    autoScroll: true,
    animate   : true,
    useArrows : true,
    lines     : false,

    viewConfig: {
        markDirty : false,
        stripeRows: true
    },
    root      : {
        text    : '_VIEWCONTROLLER_',
        expanded: true,
        value   : '',
        cls     : 'root',
        iconCls : 'no-icon',
        children: []
    }
});
