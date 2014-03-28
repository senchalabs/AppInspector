/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.ExtJS.DataView

This is a mixin, with helper methods for testing functionality relating to ExtJS dataviews. This mixin is being consumed by {@link Siesta.Test.ExtJS}

*/
Role('Siesta.Test.ExtJS.DataView', {
    
    requires        : [ 'waitFor', 'getExt' ],
    
    
    methods : {
        /**
         * Waits for the items of a dataview to render and then calls the supplied callback.
         * @param {Ext.view.View/String} view An Ext.view.View instance or a ComponentQuery 
         * @param {Function} callback A function to call when the condition has been met.
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. 
         */
        waitForViewRendered : function(view, callback, scope, timeout) {
            view = this.normalizeComponent(view);
            var hasItems    = view.store.getCount() > 0

            this.waitFor({
                method      : function() { return hasItems ? !!view.getNode(0) : view.rendered }, 
                callback    : callback,
                scope       : scope,
                timeout     : timeout,
                assertionName   : 'waitForViewRendered',
                description     : ' view ' + view.id + ' to render'
            });
        },

        /**
         * Utility method which returns the first view element.
         * 
         * @param {Ext.view.View/String} view An Ext.view.View instance or a ComponentQuery 
         * @return {Ext.Element} The first element of the view
         */
        getFirstItem : function(view) {
            view = this.normalizeComponent(view);

            var Ext = this.getExt();
            return Ext.get(view.getNode(0));
        }
    }
});
