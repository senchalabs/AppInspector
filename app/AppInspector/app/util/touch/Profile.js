/**
 * Utility class containing methods which run in the context of the inspectedWindow
 */
Ext.define('AI.util.touch.Profile', {
    singleton : true,

    /**
     * @returns {Array}
     */
    getOvernestedComponents : function () {
        var components = [],
            all = Ext.ComponentManager.all.getArray();

        Ext.Array.each(all, function (c) {
            if (c.isContainer && !c.isDocked() && !c.isXType('viewport') && !c.isXType('segmentedbutton') &&

                    //titlebar has left/right regions ('container')
                (c.parent ? !c.parent.isXType('titlebar') : true) &&

                c.items.items.length === 1) {
                components.push({
                    cmpId : c.getId(),
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
        var components = [],
            all = Ext.ComponentManager.all.getArray();

        var isContainer = function (c) {
            return (c.isContainer && !c.isDocked() && !c.isXType('viewport') && !c.isXType('segmentedbutton') &&
                    c.items.items.length > 0);
        };

        var isBoxLayout = function (c) {
            return (c.getLayout().type === 'vbox' || c.getLayout().type === 'hbox');
        };

        Ext.Array.each(all, function (cmp) {
            if (isContainer(cmp) && isBoxLayout(cmp) && cmp.getFlex()) {
                components.push({
                    cmpId : cmp.getId(),
                    xtype : cmp.xtype
                });
            }
        });

        return components;
    }
});
