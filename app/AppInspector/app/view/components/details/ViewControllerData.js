/**
 *
 */
Ext.define('AI.view.components.details.ViewControllerData', {
    extend: 'Ext.tree.Panel',
    xtype: 'viewcontrollerdata',

    requires: [
        'Ext.tree.View',
        'Ext.tree.Column'
    ],

    mixins: [
        'AI.mixin.Localize'
    ],

    title: 'MVVM ViewController',
    cls: 'treegrid highlight',
    itemId: 'viewcontrollerdata',

    // controller: 'viewcontrollerdata',
    viewModel: {
        type: 'viewcontrollerdata'
    },
    bind: {
        store: '{ViewControllers}'
    },

    config: {
        initialLoad: false
    },

    autoScroll: true,
    animate: true,
    allowDeselect: true,
    useArrows: true,
    lines: false,

    viewConfig: {
        markDirty: false,
        stripeRows: true
    },
    root: {
        text: '_VIEWCONTROLLER_',
        expanded: true,
        value: '',
        cls: 'root',
        iconCls: 'no-icon',
        children: []
    }
});
