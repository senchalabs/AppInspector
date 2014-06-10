/**
 * @class   AI.controller.Components
 * @extends Ext.app.Controller
 */
Ext.define('AI.controller.Components', {
    extend : 'Ext.app.Controller',

    requires : [
        'AI.util.Component',
        'AI.util.InspectedWindow'
    ],

    models : [
        'Component'
    ],
    stores : [
        'Components',
        'ComponentProps',
        'ComponentMethods',
        'ComponentBindings'
    ],
    views  : [
        'Components',
        'ComponentsTreeGrid'
    ],

    init : function (application) {
        var me = this;

        me.control({
            'panel#ComponentInspector'               : {
                'activate' : me.onActivate
            },
            'button#RefreshComponentTree'            : {
                'click' : me.onRefreshComponentsClick
            },
            'filterfield#FilterComponentsTree'       : {
                'applyfilter' : me.onFilterComponentTree
            },
            'componentstreegrid#ComponentTree'       : {
                'itemclick' : me.onSelectComponent
            },
            // properties
            'gridpanel#ComponentProps'               : {
                'activate'     : me.toggleComponentsDetailsTips,
                'validateedit' : me.onDetailValueEdit
            },
            'gridpanel#ComponentProps filterfield'   : {
                'applyfilter' : me.onFilterComponentDetails
            },
            // methods
            'gridpanel#ComponentMethods'             : {
                'activate' : me.toggleComponentsDetailsTips
            },
            'gridpanel#ComponentMethods filterfield' : {
                'applyfilter' : me.onFilterComponentDetails
            },

            //MVVM bindings
            'gridpanel#ComponentBindings'            : {
                'activate' : me.toggleComponentsDetailsTips
            }
        });
    },

    onActivate : function (panel) {
        // load the "Components" upfront ...
        var initialLoad = panel.initialLoad,
            tree = panel.down('#ComponentTree');

        if (!initialLoad && tree) {
            // ... but only once
            panel.initialLoad = true;

            this.onComponentTreeActivate(tree);
        }
    },

    onComponentTreeActivate : function (tree) {
        var root = tree.getRootNode();

        tree.setLoading('Loading components...');
        root.removeAll();

        AI.util.InspectedWindow.eval(
            AI.util.Component.loadComponentTree,
            null,
            function (components, isException) {
                tree.getStore().setRootNode({
                    expanded : true,
                    children : components
                });

                tree.setLoading(false);
            }
        );
    },

    onRefreshComponentsClick : function (btn) {
        var tree = btn.up('#ComponentTree'),
            filter = tree.down('#FilterComponentsTree');

        filter.reset();
        this.onComponentTreeActivate(tree);
    },

    onFilterComponentTree : function (field, value) {
        var tree = field.up('#ComponentTree');

        if (value === '') {
            tree.clearFilters();
        }
        else {
            tree.filterTree(value);
        }
    },

    onSelectComponent : function (tree, record, item, index, e, eOpts) {
        var parent = tree.up('components'),

            propsGrid = parent.down('#ComponentProps'),
            propsGridStore = propsGrid.getStore(),

            methodGrid = parent.down('#ComponentMethods'),
            methodGridStore = methodGrid.getStore(),

            bindingGrid = parent.down('#ComponentBindings'),
            bindingGridStore = bindingGrid.getStore();

        AI.util.InspectedWindow.eval(
            AI.util.InspectedWindow.highlight,
            record.get('cmpId'),
            Ext.emptyFn
        );

        AI.util.InspectedWindow.eval(
            AI.util.Component.getInspectedComponent,
            record.get('cmpId'),
            function (result, isException) {
                if (result) {
                    propsGridStore.loadData(result.properties);
                    methodGridStore.loadData(result.methods);

                    if (result.mvvm && result.mvvm.bindings) {
                        bindingGridStore.loadData(result.mvvm.bindings);
                        bindingGrid.enable();
                    }
                    else {
                        bindingGridStore.loadData([]);
                        bindingGrid.disable();
                    }
                }
                else {
                    propsGridStore.loadData([]);
                    methodGridStore.loadData([]);

                    bindingGrid.disable();
                    bindingGridStore.loadData([]);
                }
            }
        );
    },

    toggleComponentsDetailsTips : function (grid) {
        var tips = grid.up('#ComponentInspector').down('toolbar[dock=bottom]'),
            isProps = grid.itemId === 'ComponentProps',
            isMethods = grid.itemId === 'ComponentMethods',
            props = tips.query('[tipGroup=props]'),
            methods = tips.query('[tipGroup=methods]'),
            i;

        if (!isProps && !isMethods) {
            tips.setVisible(false);
            return;
        }
        else {
            tips.setVisible(true);
        }

        for (i = 0; i < props.length; i++) {
            props[i].setVisible(isProps);
        }

        for (i = 0; i < methods.length; i++) {
            methods[i].setVisible(isMethods);
        }
    },

    onFilterComponentDetails : function (field, value) {
        var grid = field.up('gridpanel'),
            store = grid.getStore();

        store.clearFilter();

        if (value !== '') {
            store.filter([
                {
                    anyMatch      : true,
                    caseSensitive : false,
                    property      : 'name',
                    value         : value
                }
            ]);
        }
    },

    onDetailValueEdit : function () {
        // cancel edit to reset original value
        return false;
    }

});
