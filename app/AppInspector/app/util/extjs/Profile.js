/**
 * @class   AI.util.extjs.Profile
 * @singleton
 *
 * Utility class containing methods which run in the context of the inspectedWindow
 */
Ext.define('AI.util.extjs.Profile', {
    singleton: true,

    /**
     * @returns {Array}
     */
    getOvernestedComponents: function() {
        var components = [];

        Ext.ComponentManager.each(function(id) {
            var c = Ext.getCmp(id);
            if (c.isContainer && !c.isHeader && !c.isXType('tablepanel') && !c.isXType('headercontainer') && !c.hasCls('x-fieldset-header') && c.items.items.length === 1) {
                components.push({
                    cmpId: c.id,
                    xtype: c.xtype
                });
            }
        });

        return components;
    },

    /**
     * @returns {Array}
     */
    getNestedBoxLayouts: function() {
        var components = [];

        var isContainer = function(c) {
            return (c.isContainer && !c.isHeader && !c.isXType('tablepanel') && !c.isXType('headercontainer') && !c.hasCls('x-fieldset-header') &&
                c.items.items.length > 0);
        };

        var isBoxLayout = function(c) {
            return (c.getLayout().type === 'vbox' || c.getLayout().type === 'hbox');
        };

        Ext.ComponentManager.each(function(id) {
            var cmp = Ext.getCmp(id);

            if (isContainer(cmp) && isBoxLayout(cmp) && cmp.flex) {
                components.push({
                    cmpId: cmp.id,
                    xtype: cmp.xtype
                });
            }
        });

        return components;
    },

    /**
     *
     */
    stopLayouts: function() {
        if (Ext.ux.AppInspector.layoutCaptureFn) {
            Ext.layout.Context.prototype.runComplete = Ext.ux.AppInspector.layoutCaptureFn;

            Ext.ux.AppInspector.layoutRunTotal = null;
            Ext.ux.AppInspector.layoutCollection = null;
            Ext.ux.AppInspector.layoutCaptureFn = null;
        }
    },

    /**
     * @returns {Array}
     */
    recordLayouts: function() {
        if (Ext.ux.AppInspector.layoutRunTotal === null) {
            Ext.ux.AppInspector.layoutRunTotal = 0;
            Ext.ux.AppInspector.layoutCollection = [];

            //store a reference so we can reset it later
            Ext.ux.AppInspector.layoutCaptureFn = Ext.layout.Context.prototype.runComplete;

            //create an intercept function for our purposes
            var interceptFn = function() {
                Ext.ux.AppInspector.layoutRunTotal++;

                var items = [];

                Ext.Object.each(this.items, function(key, item) {
                    //TODO: is there any better way to do this?
                    // "item" is an Ext.layout.ContextItem and I don't see any way to access the original component
                    // item.target?
                    var comp = Ext.getCmp(key);

                    if (comp) {
                        items.push({
                            text: comp.id + (comp.itemId ? ' (' + comp.itemId + ')' : ''),
                            cmpId: comp.id || '',
                            itemId: comp.itemId || '',
                            xtype: comp.xtype,
                            children: []
                        });
                    } else {
                        items.push({
                            text: key,
                            cmpId: '',
                            itemId: '',
                            xtype: '',
                            children: []
                        });
                    }
                });

                Ext.ux.AppInspector.layoutCollection.push({
                    text: 'Layout run #' + Ext.ux.AppInspector.layoutRunTotal + ' (' + items.length + ' items)',
                    cmpId: '',
                    itemId: '',
                    xtype: '',
                    children: items
                });
            };

            Ext.layout.Context.prototype.runComplete = function() {
                Ext.ux.AppInspector.layoutCaptureFn.apply(this, arguments);
                return interceptFn.apply(this, arguments);
            };
        }

        var layouts = Ext.ux.AppInspector.layoutCollection;

        //clear each time so we don't duplicate
        Ext.ux.AppInspector.layoutCollection = [];

        return layouts;
    }
});
