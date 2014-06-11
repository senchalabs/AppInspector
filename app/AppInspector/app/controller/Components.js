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
        'components.Bindings',
        'components.Components',
        'components.Methods',
        'components.Properties',
        'components.ViewModelData'
    ],

    views  : [
        'Components'
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
            },

            //Inheritance model
            'ai-components-inheritancemodel' : {
                activate : me.toggleComponentsDetailsTips
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

    onSelectComponent : function (tree, record) {
        var parent = tree.up('components'),

            propsGrid = parent.down('#ComponentProps'),
            propsGridStore = propsGrid.getStore(),

            methodGrid = parent.down('#ComponentMethods'),
            methodGridStore = methodGrid.getStore(),

            bindingGrid = parent.down('#ComponentBindings'),
            bindingGridStore = bindingGrid.getStore(),

            vmTree = parent.down('ai-components-viewmodels'),

            inheritanceModel = parent.down('ai-components-inheritancemodel');

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

                    if (result.mvvm && result.mvvm.viewModel) {
                        vmTree.getStore().setRootNode({
                            expanded : true,
                            children : result.mvvm.viewModel
                        });

                        vmTree.enable();
                    }
                    else {
                        vmTree.getStore().setRootNode({
                            expanded : true,
                            children : []
                        });

                        vmTree.disable();
                    }

                    if (result.inheritance) {
                        inheritanceModel.enable();
                        inheritanceModel.renderDiagram(result.inheritance)
                    }

                }
                else {
                    inheritanceModel.disable();
                    propsGridStore.loadData([]);
                    methodGridStore.loadData([]);

                    bindingGrid.disable();
                    bindingGridStore.loadData([]);

                    inheritanceModel.disable();
                }
            }
        );
    },

    toggleComponentsDetailsTips : function (view) {
        var tipsToolbar   = view.up('#ComponentInspector').down('toolbar[dock=bottom]'),
            isProps       = view.itemId === 'ComponentProps',
            isMethods     = view.itemId === 'ComponentMethods',
            isInheritance = view.xtype == 'ai-components-inheritancemodel',
            superClsTip   = tipsToolbar.query('[tipGroup=superclass]')[0],
            mixinTip      = tipsToolbar.query('[tipGroup=mixin]')[0],
            props         = tipsToolbar.query('[tipGroup=props]')[0],
            methods       = tipsToolbar.query('[tipGroup=methods]')[0],
            both          = tipsToolbar.query('[tipGroup=both]')[0],
            i;

        if (!isProps && !isMethods && !isInheritance) {
            tipsToolbar.setVisible(false);
            return;
        }
        else {
            tipsToolbar.setVisible(true);
        }

        // Todo: Replace w/ a state machine mechanism
        // Todo: Replace bootom-docked toolbar (tipsToolbar) with a custom view (much more efficient)
        if (isProps) {
            methods.setVisible(false);
            both.setVisible(true);
            props.setVisible(true);
            superClsTip.setVisible(false);
            mixinTip.setVisible(false);
        }

        if (isMethods) {
            methods.setVisible(true);
            props.setVisible(false);
            both.setVisible(true);
            superClsTip.setVisible(false);
            mixinTip.setVisible(false);
        }


        if (isInheritance) {
            methods.setVisible(false);
            props.setVisible(false);
            both.setVisible(false);
            superClsTip.setVisible(true);
            mixinTip.setVisible(true);
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
