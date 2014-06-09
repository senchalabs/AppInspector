/**
 * @class   AI.view.About
 * @extends Ext.panel.Panel
 */
Ext.define('AI.view.About', {
    extend : 'Ext.panel.Panel',
    alias  : 'widget.about',

    requires : [
        'Ext.grid.property.Grid'
    ],

    itemId  : 'About',
    iconCls : 'icn-home',
    title   : 'App Details',

    layout : {
        type  : 'vbox',
        align : 'stretch'
    },

    initComponent : function () {
        var me = this;

        Ext.applyIf(me, {
            items     : [
                {
                    xtype           : 'propertygrid',
                    flex            : 1,
                    itemId          : 'AppDetails',
                    minHeight       : 150,
                    header          : false,
                    iconCls         : 'icon-home',
                    emptyText       : 'No Sencha framework found!',
                    nameColumnWidth : '50%',
                    source          : {

                    },
                    sourceConfig    : {
                        core  : {
                            displayName : 'Core Version'
                        },
                        touch : {
                            displayName : 'Touch Version'
                        },
                        extjs : {
                            displayName : 'Ext JS Version'
                        },
                        ext   : {
                            displayName : 'Ext JS Version'
                        },
                        name  : {
                            displayName : 'Application Name'
                        }
                    }
                },
                {
                    xtype            : 'panel',
                    flex             : 2,
                    cls              : 'about-details',
                    itemId           : 'AboutDetails',
                    loader           : {
                        url      : 'about.html',
                        autoLoad : true
                    },
                    autoScroll       : true,
                    bodyPadding      : '5 10',
                    animCollapse     : false,
                    collapsible      : true,
                    hideCollapseTool : true,
                    title            : 'About App Inspector for Sencha',
                    titleCollapse    : true
                }
            ],
            listeners : {
                beforeadd : {
                    fn    : me.onAboutBeforeAdd,
                    scope : me
                }
            }
        });

        me.callParent(arguments);
    },

    onAboutBeforeAdd : function (container, component, index, eOpts) {
        this.setTitle(AI.util.i18n.getMessage(this.title));

    }

});
