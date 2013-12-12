Ext.define('AI.controller.Profile', {
    extend : 'Ext.app.Controller',

    requires : [
        'AI.store.Overnested'
    ],

    init : function () {
        this.control({
            'ai-view-profile-overnesting' : {
                'afterrender' : this.onOvernestedGridRender,
                'select'      : this.onSelectOvernestedComponent
            },

            'button#ProfileOvernesting' : {
                click : this.onOvernestedProfileClick
            },

            'ai-view-profile-boxlayouts' : {
                'afterrender' : this.onOvernestedGridRender,
                'select'      : this.onSelectOvernestedComponent
            },

            'button#ProfileBoxLayouts' : {
                click : this.onNestedBoxLayoutsClick
            }
        });
    },

    onOvernestedGridRender : function (grid) {
        var newStore = Ext.create('AI.store.Overnested', {});

        grid.reconfigure(newStore);
    },

    onOvernestedProfileClick : function (btn) {
        var grid = btn.up('ai-view-profile-overnesting'),
            store = grid.getStore();

        store.removeAll();
        grid.setLoading('Profiling for overnested components...');

        var getOvernestedFromInspectedWindow = function () {
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
        };

        chrome.devtools.inspectedWindow.eval(
            '(' + getOvernestedFromInspectedWindow + ')()',
            function (components, isException) {
                if (isException) {
                    AI.util.parseException(isException);
                    return;
                }

                Ext.each(components, function (component) {
                    var model = Ext.create('AI.model.Overnested', component);

                    store.add(model);
                });

                grid.setLoading(false);
            }
        );
    },

    onSelectOvernestedComponent : function (selModel, record, index, eOpts) {
        var highlightOvernestedInInspectedWindow = function (id) {
            Ext.getCmp(id).el.frame('red');
        };

        chrome.devtools.inspectedWindow.eval(
            '(' + highlightOvernestedInInspectedWindow + ')("' + record.get('cmpId') + '")',
            function (components, isException) {
                if (isException) {
                    AI.util.parseException(isException);
                    return;
                }
            }
        );
    },

    onNestedBoxLayoutsClick : function (btn) {
        var grid = btn.up('ai-view-profile-boxlayouts'),
            store = grid.getStore();

        store.removeAll();
        grid.setLoading('Profiling for overnested box layouts...');

        var getNestedBoxLayoutsFromInspectedWindow = function () {
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
        };

        chrome.devtools.inspectedWindow.eval(
            '(' + getNestedBoxLayoutsFromInspectedWindow + ')()',
            function (components, isException) {
                if (isException) {
                    AI.util.parseException(isException);
                    return;
                }

                Ext.each(components, function (component) {
                    var model = Ext.create('AI.model.Overnested', component);

                    store.add(model);
                });

                grid.setLoading(false);
            }
        );
    }
});