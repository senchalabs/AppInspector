/**
 *
 */
Ext.define('AI.view.components.details.InheritanceModel', {
    extend: 'Ext.container.Container',
    xtype: 'inheritancemodel',

    requires: [],

    mixins: [
        'AI.mixin.Localize'
    ],

    // controller: 'inheritancemodel',
    // viewModel: {
    //     type: 'inheritancemodel'
    // },

    title: 'Inheritance Model',
    itemId: 'inheritancemodel',

    // TODO: remove
    bodyPadding: 8,
    html: '<pre>// TODO: wait for Jay\'s commit...</pre>',
    disabled: true
});
