Ext.define('AI.controller.Profile', {
    extend : 'Ext.app.Controller',

    init : function () {
        this.control({
            'ai-view-profile-overnesting' : {
                'afterrender' : this.onOvernestedGridRender,
                'select'      : this.onSelectOvernestedComponent
            },

            'button#Profile' : {
                click : this.onOvernestedProfileClick
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
                        id    : c.id,
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

    onSelectOvernestedComponent : function(selModel, record, index, eOpts) {
        var highlightOvernestedInInspectedWindow = function (id) {
            Ext.getCmp(id).el.frame('red');
        };

        chrome.devtools.inspectedWindow.eval(
            '(' + highlightOvernestedInInspectedWindow + ')("' + record.get('id')  + '")',
            function (components, isException) {
                if (isException) {
                    AI.util.parseException(isException);
                    return;
                }
            }
        );
    }
});
