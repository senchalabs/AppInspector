/**
 * @class   AI.view.about.About
 * @extends Ext.panel.Panel
 */
Ext.define('AI.view.about.About', {
    extend: 'Ext.panel.Panel',
    xtype : 'about',

    requires: [
        'Ext.layout.container.VBox',
        'Ext.grid.property.Grid'
    ],

    mixins: [
        'AI.mixin.Localize'
    ],

    title : 'App Details',
    glyph : 'xf015@fontawesome',
    layout: {
        type : 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype          : 'propertygrid',
            itemId         : 'appdetails',
            flex           : 1,
            minHeight      : 150,
            header         : false,
            emptyText      : 'No Sencha framework found!',
            nameColumnWidth: '50%',
            source         : {},
            sourceConfig   : {
                core         : {
                    displayName: 'Sencha Core Version'
                },
                'sencha-core': {
                    displayName: 'Sencha Core Version'
                },
                touch        : {
                    displayName: 'Sencha Touch Version'
                },
                extjs        : {
                    displayName: 'Ext JS Version'
                },
                ext          : {
                    displayName: 'Ext JS Version'
                },
                name         : {
                    displayName: 'Application Namespace'
                }
            }
        },
        {
            xtype           : 'panel',
            itemId          : 'aboutdetails',
            flex            : 2,
            cls             : 'about-details',
            loader          : {
                url     : 'about.html',
                autoLoad: true
            },
            autoScroll      : true,
            bodyPadding     : '5 10',
            ui              : 'about',
            animCollapse    : false,
            collapsible     : true,
            hideCollapseTool: true,
            title           : 'About App Inspector for Sencha',
            titleCollapse   : true
        }
    ],

    listeners: {
        beforeadd: {
            fn    : 'localize',
            single: true,
            scope : 'this'
        }
    }
});
