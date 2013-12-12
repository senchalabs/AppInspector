/**
 * Utility class containing methods which run in the context of the inspectedWindow
 */
Ext.define('AI.util.Profile', {
    singleton : true,

    /**
     * @returns {Array}
     */
    getOvernestedComponents : function () {
        var components = [];

        Ext.ComponentManager.each(function (id) {
            var c = Ext.getCmp(id);
            if (c.isContainer && !c.isHeader && !c.isXType('tablepanel') && !c.isXType('headercontainer') && !c.hasCls('x-fieldset-header') && c.items.items.length === 1) {
                components.push({
                    cmpId : c.id,
                    xtype : c.xtype
                });
            }
        });

        return components;
    },

    /**
     * @returns {Array}
     */
    getNestedBoxLayouts : function () {
        var components = [];
        var isContainer = function (c) {
            return (c.isContainer && !c.isHeader && !c.isXType('tablepanel') && !c.isXType('headercontainer') && !c.hasCls('x-fieldset-header') &&
                    c.items.items.length > 0);
        };

        var isBoxLayout = function (c) {
            return (c.getLayout().type === 'vbox' || c.getLayout().type === 'hbox');
        };
        Ext.ComponentManager.each(function (id) {
            var cmp = Ext.getCmp(id);

            if (isContainer(cmp) && isBoxLayout(cmp) && cmp.flex) {
                components.push({
                    cmpId : cmp.id,
                    xtype : cmp.xtype
                });
            }
        });

        return components;
    }
});