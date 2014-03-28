/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.Viewport', {

    extend          : 'Ext.container.Viewport',
    
    mixins          : [
        'Siesta.Harness.Browser.UI.CanFillAssertionsStore'
    ],

//    requires        : [
//        'Ext.state.LocalStorageProvider',
//        'Ext.state.CookieProvider',
//
//        'ExtX.Reference.Slot',
//
//        'Siesta.Harness.Browser.Model.TestTreeStore',
//        'Siesta.Harness.Browser.UI.TestGrid',
//        'Siesta.Harness.Browser.UI.ResultPanel',
//        'Siesta.Harness.Browser.UI.MouseVisualizer',
//        'Siesta.Harness.Browser.UI.Header'
//    ],

    title           : null,

    harness         : null,

    // need to set stateful properties before `initComponent`
    stateful        : false,

    // stateful
    selection       : null,
    selectedURL     : null,
    filter          : null,
    filterGroups    : false,
    // eof stateful

    testsStore      : null,

    contextMenu     : null,
    mouseVisualizer : null,

    collapsedNodes  : null,

    initComponent : function () {
        Ext.state.Manager.setProvider(Ext.supports.LocalStorage ? new Ext.state.LocalStorageProvider() : new Ext.state.CookieProvider())

        this.selection      = {}
    
        if (this.harness.stateful) this.applyState(this.loadState())

        var testsStore      = this.testsStore = new Siesta.Harness.Browser.Model.FilterableTreeStore({
            model           : 'Siesta.Harness.Browser.Model.TestFile',
        
            sortOnLoad      : false,
        
            root            : { expanded : true, loaded : true },
        
            proxy           : {
                type        : 'memory',
            
                data        : this.buildTreeData({
                    id          : 'root',
                    group       : 'test suite' + this.title,
                    items       : this.harness.descriptors
                }).children,
            
                reader      : {
                    type    : 'json'
                }
            },
            
            listeners       : {
                collapse    : this.saveState,
                expand      : this.saveState,
                
                scope       : this
            }
        })
    
        testsStore.load()

        Ext.apply(this, {
            mouseVisualizer : Ext.isIE ? undefined : new Siesta.Harness.Browser.UI.MouseVisualizer({ harness : this.harness }),
            slots           : true,
            plugins         : new Siesta.Harness.Browser.UI.VersionChecker({ renderTo : 'update-ct'}),
            layout          : 'border',

            items           : [
                {
                    region      : 'west',

                    xtype       : 'testgrid',
                    slot        : 'filesTree',
                    id          : this.harness.id + '-testTree',

                    iconCls     : 'tr-status-neutral-small',

                    stateConfig : this.getState(),

                    animate     : !Ext.isIE,
                    split       : true,

                    filter          : this.filter,
                    filterGroups    : this.filterGroups,

                    listeners   : {
                        selectionchange     : this.onSelectionChange,
                        checkchange         : this.onCheckChange,

                        itemcontextmenu     : this.onFilesContextMenu,
                        itemdblclick        : this.onTestFileDoubleClick,
                        showcoverageinfo    : this.showCoverageReport,

                        resize              : function () {
                            // preserve min width of the assertion grid
                            this.slots.resultPanel.ensureLayout()
                        },

                        scope               : this
                    },

                    store       : testsStore
                },
                {
                    xtype           : 'container',
                    slot            : 'center',
                    region          : 'center',
                    cls             : 'center-ct',
                    layout          : {
                        type            : 'card',
                        deferredRender  : true
                    },
                    items           : [
                        {
                            xtype       : 'resultpanel',
                            region      : 'center',
                            slot        : 'resultPanel',
                            cls         : 'resultPanel-panel',
                            viewDOM     : this.getOption('viewDOM'),
                            id          : this.harness.id + '-resultpanel',
                            harness     : this.harness,

                            maintainViewportSize    : this.harness.maintainViewportSize,

                            listeners       : {
                                viewdomchange       : function(g, value) {
                                    this.setOption('viewDOM', value);
                                    this.saveState();
                                },

                                startrecord         : function() {
//                                    this.slots.filesTree.collapse();
                                },

                                rerun               : this.rerunTest,

                                scope               : this
                            }
                        },
                        {
                            xtype               : Ext.ClassManager.getByAlias('widget.coveragereport') ? 'coveragereport' : 'container',
                            slot                : 'coverageReport',
                            listeners           : {
                                backtomainui    : this.showMainUI,
                                scope           : this
                            }
                        }
                    ]
                }
            ]
            // eof main content area
        })
    
        this.callParent()
        
        // for some reason doesn't work, when specified as the "listeners" config in the "viewConfig" option above
        this.slots.filesTree.getView().on('viewready', this.onViewReady, this, { single : true })

        this.slots.filesTree.on({
            optionchange            : this.onOptionChange,
            beforesettingsmenushow  : this.onSettingsMenuBeforeShow,
            buttonclick             : this.onMainButtonClick,

            collapse                : function() {
                Ext.getBody().down('.logo-link').hide();
            },

            expand                  : function() {
                Ext.getBody().down('.logo-link').show();
            },

            scope                   : this
        });

        // delay is required to avoid recursive loop
        this.on('afterlayout', this.onAfterLayout, this, { single : true, delay : 1 })
        
        this.slots.filesTree.store.on({
            'filter-set'        : this.saveState,
            'filter-clear'      : this.saveState,
            
            scope               : this
        })
        
        this.harness.on('testendbubbling', this.onEveryTestEnd, this)
        this.harness.on('hassomecoverageinfo', this.onHasSomeCoverageInfo, this)
        this.harness.on('nocoverageinfo', this.onNoCoverageInfo, this)
        this.harness.on('testsuitelaunch', this.onTestSuiteLaunch, this)
    },

    
    buildTreeData : function (descriptor) {
        var data    = {
            id          : descriptor.id,
            title       : descriptor.group || descriptor.title || descriptor.name || descriptor.url.replace(/(?:.*\/)?([^/]+)$/, '$1'),
            descriptor  : descriptor
        }
    
        var me              = this
        var prevId          = data.id
        var collapsedNodes  = this.collapsedNodes || {}
    
        if (descriptor.group) {
        
            var children    = []
        
            Ext.each(descriptor.items, function (desc) {
                children.push(me.buildTreeData(desc))
            })
        
            Ext.apply(data, {
                expanded        : (collapsedNodes[ prevId ] != null || descriptor.expanded === false) ? false : true,
                // || false is required for TreeView - it checks that "checked" field contains Boolean
                checked         : me.selection.hasOwnProperty(prevId) || false,
            
                folderStatus    : 'yellow',
            
                children        : children,
                leaf            : false
            })
        
        } else {
            Ext.apply(data, {
                url             : descriptor.url,
            
                leaf            : true,
                // || false is required for TreeView - it checks that "checked" field contains Boolean
                checked         : me.selection.hasOwnProperty(prevId) || false,
            
                passCount       : 0,
                failCount       : 0,
            
                time            : 0,
            
                assertionsStore : new Siesta.Harness.Browser.Model.AssertionTreeStore({
                    //autoDestroy : true,
                    model       : 'Siesta.Harness.Browser.Model.Assertion',
                    
                    proxy       : {
                        type        : 'memory',
                        reader      : { type : 'json' }
                    },
                    
                    root        : {
                        id              : '__ROOT__',
                        expanded        : true,
                        loaded          : true
                    }
                })
            })
        }
    
        return data
    },


    onAfterLayout : function () {
        if (this.getOption('autoRun')) {
            var checked     = this.getChecked()
        
            // either launch the suite for checked tests or for all
            this.harness.launch(checked.length && checked || this.harness.descriptors)
        }
    },


    onViewReady : function () {
        if (this.selectedURL) {
            var testFile    = this.testsStore.getNodeById(this.selectedURL)
        
            if (testFile) this.slots.filesTree.getSelectionModel().select(testFile)
        }
    },


    onSelectionChange : function (selModel, selectedRecords) {
    
        if (selectedRecords.length) {
            var testFile        = selectedRecords[ 0 ]
            var test            = testFile.get('test')
        
            if (test) this.slots.resultPanel.showTest(test, testFile.get('assertionsStore'))
        
            this.selectedURL = testFile.getId()
        
            this.saveState()
        }
    },


    onCheckChange : function (testFile, checked) {
        this.setNodeChecked(testFile, checked)
    },


    setNodeChecked : function (testFile, checked, doNotCascade, skipSave) {
        var me      = this
        var id      = testFile.getId()
    
        if (checked)
            this.selection[ id ] = 1
        else
            delete this.selection[ id ]

        
        testFile.set('checked', checked)
        
        // when unchecking the node - uncheck the parent node (folder) as well 
        if (!checked && testFile.parentNode) me.setNodeChecked(testFile.parentNode, false, true, true)
    
        // only cascade for folders and when `doNotCascade` is false
        if (!testFile.isLeaf() && !doNotCascade) Ext.each(testFile.childNodes, function (childNode) {
            me.setNodeChecked(childNode, checked, false, true)
        })
    
        if (!skipSave) this.saveState()
    },


    // returns the NodeStore of the TreeStore - flattened presentation of the tree (it's potentially filtered)
    getNodeStore : function () {
        return this.slots.filesTree.getView().store
    },
    
    
    forEachTestFile : function (func, scope) {
        var nodeStore   = this.getNodeStore()
        
        if (this.testsStore.isTreeFiltered())
            nodeStore.each(func, scope)
        else
            Ext.Array.each(this.testsStore.tree.flatten(), func, scope)
    },


    getChecked : function () {
        var descriptors     = []
    
        this.forEachTestFile(function (testFileRecord) {
        
            if (testFileRecord.get('checked') && testFileRecord.isLeaf()) descriptors.push(testFileRecord.get('descriptor'))
        })
    
        return descriptors
    },

    runChecked : function () {
        var checked = this.getChecked();

        if (checked.length > 0) {
            this.harness.launch(this.getChecked())
        }
    },


    runFailed : function () {
        var descriptors     = []

        this.forEachTestFile(function (testFileRecord) {

            var test    = testFileRecord.get('test')

            if (test && test.isFailed()) descriptors.push(testFileRecord.get('descriptor'))
        })

        if (descriptors.length > 0) {
            this.harness.launch(descriptors)
        }
    },


    runAll : function () {
        var allDesc     = []

        this.forEachTestFile(function (testFile) {
            if (testFile.isLeaf()) allDesc.push(testFile.get('descriptor'))
        })

        if (allDesc.length > 0) {
            this.harness.launch(allDesc)
        }
    },


    stopSuite : function (button) {
        this.performStop();
        button.disable()
    
        setTimeout(function () {
        
            button.enable()
        
        }, 1000)
    },

    performStop : function() {
        this.harness.needToStop = true;
    
        Ext.each(this.testsStore.tree.flatten(), function (testFileRecord) {
            if (testFileRecord.get('isStarting') && !testFileRecord.get('isStarted')) {
                testFileRecord.set('isStarting', false);
            }
        });
    },


    // looks less nice than setting it only after preload for some reason
    onBeforeScopePreload : function (scopeProvider, url) {
        var testRecord          = this.testsStore.getNodeById(url)
    
        // to avoid disturbing grid
        testRecord.data.isStarted = true
    },


    isTestRunningVisible : function (test) {
        // return false for test's running in popups (not iframes), since we can't show any visual accompaniment for them
        if (!(test.scopeProvider instanceof Scope.Provider.IFrame)) return false;
    
        // if there is a "forced to be on top" test then we only need to compare the tests instances
        if (this.harness.testOfForcedIFrame) {
            return this.harness.testOfForcedIFrame.isFromTheSameGeneration(test)
        }
    
        // otherwise the only possibly visible test is the one of the current assertion grid
        var resultPanel = this.slots.resultPanel;
    
        // if resultPanel has no testRecord it hasn't yet been assigned a test record
        if (!resultPanel.test || !resultPanel.test.isFromTheSameGeneration(test)) {
            return false;
        }
    
        // now we know that visible assertion grid is from our test and there is no "forced on top" test
        // we only need to check visibility (collapsed / expanded of the right panel 
        return resultPanel.isFrameVisible()
    },
    
    
    resetDescriptors : function(descriptors) {
        var testsStore          = this.testsStore;

        Joose.A.each(this.harness.flattenDescriptors(descriptors), function(descriptor){
            var testRecord = testsStore.getNodeById(descriptor.id);
        
            testRecord.get('assertionsStore').removeAll(true)
            testRecord.reject();
            // || false is required for TreeView - it checks that "checked" field contains Boolean
            testRecord.set('checked', this.selection.hasOwnProperty(descriptor.id) || false)
        }, this);
    },


    // method is called when test suite (any several tests) starts - before caching the script contents
    // at this point we don't know yet about missing test files
    onTestSuiteStart : function (descriptors) {
        Ext.getBody().addCls('testsuite-running');

        var harness             = this.harness
        var filesTree           = this.slots.filesTree
        var selModel            = filesTree.getSelectionModel()
        var prevSelection       = selModel.getLastSelected()
        var testsStore          = this.testsStore
    
        Ext.suspendLayouts();
        
        this.resetDescriptors(descriptors);
    
        // restore the selection after data reload
        if (prevSelection) selModel.select(testsStore.getNodeById(prevSelection.getId()))
    },


    // method is called when test suite (any several tests) launches - after the caching the script contents
    // has completed and 1st test is about to start
    // at this point we know about missing files and `desc.isMissing` property is set
    onTestSuiteLaunch : function (event, descriptors) {
        var testsStore          = this.testsStore
    
        var updated             = {}
    
        Joose.A.each(this.harness.flattenDescriptors(descriptors), function (descriptor) {
            var testRecord  = testsStore.getNodeById(descriptor.id)
        
            testRecord.set({
                isMissing   : descriptor.isMissing,
                isStarting  : true
            })
            
            var groupNode   = testRecord.parentNode
            
            if (groupNode && !updated[ groupNode.getId() ]) {
                // trying hard to prevent extra updates
                for (var node = groupNode; node; node = node.parentNode) updated[ node.getId() ] = true
                
                groupNode.updateFolderStatus()
            }
        })

        Ext.resumeLayouts();
    },
    
    
    onTestSuiteEnd : function (descriptors) {
        Ext.getBody().removeCls('testsuite-running');
        
        this.updateStatusIndicator();

        if (this.slots.center.getLayout().getActiveItem() === this.slots.coverageReport) {
            // Load new data into coverage report
            this.slots.coverageReport.loadHtmlReport(this.harness.generateCoverageHtmlReport(false));
        }
    },
    

    onTestStart : function (test) {
        var testRecord          = this.testsStore.getNodeById(test.url)
        
        testRecord.beginEdit()
    
        // will trigger an update in grid
        testRecord.set({
            test        : test,
            isRunning   : true
        })
        
        testRecord.endEdit()
        
        var currentSelection    = this.slots.filesTree.getSelectionModel().getLastSelected()
    
        // activate the assertions grid for currently selected row, or, if the main area is empty
        if (currentSelection && currentSelection.getId() == test.url) {
            var resultPanel         = this.slots.resultPanel
            
            resultPanel.showTest(test, testRecord.get('assertionsStore'))
        }
    },
    
    
    // this method checks that test update, coming from given `test` is actual
    // update may be not actual, if user has re-launched the test, so new test already presents
    isTestUpdateActual : function (test, testRecord) {
        testRecord          = testRecord || this.testsStore.getNodeById(test.url)
        
        var currentTest     = testRecord.get('test')
        
        return currentTest && currentTest.isFromTheSameGeneration(test)
    },


    onTestUpdate : function (test, result, parentResult) {
        var testRecord      = this.testsStore.getNodeById(test.url)
        
        // need to check that test record contains the same test instance as the test in arguments (or its sub-test)
        // test instance may change if user has restarted a test for example
        if (this.isTestUpdateActual(test, testRecord)) {
            this.processNewResult(testRecord.get('assertionsStore'), test, result, parentResult)
            
            if (this.getOption('breakOnFail') && test.getFailCount() > 0) {
                this.performStop();
                this.slots.filesTree.getSelectionModel().select(testRecord);
            }
        }
    },



    // only triggered for "root" tests
    onTestEnd : function (test) {
        var testRecord          = this.testsStore.getNodeById(test.url)
        
        // need to check that test record contains the same test instance as the test in arguments (or its sub-test)
        // test instance may change if user has restarted a test for example
        if (this.isTestUpdateActual(test, testRecord)) {
            testRecord.beginEdit()
    
            testRecord.set({
                'passCount'         : test.getPassCount(),
                'failCount'         : test.getFailCount(),
                'todoPassCount'     : test.getTodoPassCount(),
                'todoFailCount'     : test.getTodoFailCount(),
                'time'              : test.getDuration() + 'ms'
            });
      
            testRecord.endEdit()
        
            testRecord.parentNode && testRecord.parentNode.updateFolderStatus()
        }
        
        this.updateStatusIndicator()
    },
    
    
    // is bubbling and thus triggered for all tests (including sub-tests) 
    onEveryTestEnd : function (event, test) {
        var testRecord          = this.testsStore.getNodeById(test.url)
        
        // need to check that test record contains the same test instance as the test in arguments (or its sub-test)
        // test instance may change if user has restarted a test for example
        if (this.isTestUpdateActual(test, testRecord)) {
            this.processEveryTestEnd(testRecord.get('assertionsStore'), test)
        }
    },
    
    
    onTestFail : function (test, exception, stack) {
        var testRecord  = this.testsStore.getNodeById(test.url)
        
        // need to check that test record contains the same test instance as the test in arguments
        // test instance may change if user has restarted a test for example
        if (this.isTestUpdateActual(test, testRecord) && !test.isTodo) {
            testRecord.set('isFailed', true)
        
            testRecord.parentNode && testRecord.parentNode.updateFolderStatus()
        }
    },
    
    
    getOption : function (name) {
        switch (name) {
            case 'selection'    : return this.selection
            
            case 'selectedURL'  : return this.selectedURL
            
            default             : return this.harness[ name ]
        }
    },
    
    
    setOption : function (name, value) {
        switch (name) {
            case 'selection'    : return this.selection         = value || {}
            
            case 'selectedURL'  : return this.selectedURL       = value
            
            case 'collapsedNodes': return this.collapsedNodes   = value
            
            case 'filter'       : return this.filter            = value
            case 'filterGroups' : return this.filterGroups      = value
            
            default             : return this.harness[ name ]   = value
        }
    },


    getState : function () {
        return {
            // harness configs
            autoRun         : this.getOption('autoRun'),
            speedRun        : this.getOption('speedRun'),
            viewDOM         : this.getOption('viewDOM'),
            keepResults     : this.getOption('keepResults'),
            cachePreload    : this.getOption('cachePreload'),
            transparentEx   : this.getOption('transparentEx'),
            breakOnFail     : this.getOption('breakOnFail'),
        
            // UI configs
            selectedURL     : this.selectedURL,
            
            selection       : this.getCheckedNodes(),
            collapsedNodes  : this.getCollapsedFolders(),
            
            filter          : this.slots ? this.slots.filesTree.getFilterValue() : this.filter,
            filterGroups    : this.slots ? this.slots.filesTree.getFilterGroups() : this.filterGroups
        }
    },
    
    
    getCheckedNodes : function () {
        var checked        = {}
        
        Joose.A.each(this.testsStore.tree.flatten(), function (treeNode) {
            if (treeNode.get('checked')) checked[ treeNode.getId() ] = 1
        })
        
        return checked
    },
    
    
    getCollapsedFolders : function () {
        var collapsed        = {}
        
        Joose.A.each(this.testsStore.tree.flatten(), function (treeNode) {
            if (!treeNode.isLeaf() && !treeNode.isExpanded()) collapsed[ treeNode.getId() ] = 1
        })
        
        return collapsed
    },
    
    
    applyState : function (state) {
        var me  = this
        
        if (state) Joose.O.each(state, function (value, name) {
            me.setOption(name, value)
        })
    },


    getStateId : function () {
        return 'test-run-' + this.title
    },


    onOptionChange : function (component, optionName, optionValue) {
        this.setOption(optionName, optionValue)
    
        if (optionName == 'viewDOM') {
            var resultPanel = this.slots.resultPanel;
            
            resultPanel.setViewDOM(optionValue);
        }

        this.saveState()
    },
    
    
    loadState : function () {
        var stateId     = this.getStateId()
        var state       = Ext.state.Manager.get(stateId)
        
        if (!state) return
        
        if (!state.collapsedNodes)  state.collapsedNodes    = Ext.state.Manager.get(stateId + '-collapsed')
        if (!state.selection)       state.selection         = Ext.state.Manager.get(stateId + '-selection')
        
        return state
    },


    saveState : function () {
        var stateId     = this.getStateId()
        var state       = this.getState()
        
        Ext.state.Manager.set(stateId + '-collapsed', state.collapsedNodes)
        Ext.state.Manager.set(stateId + '-selection', state.selection)
        
        delete state.collapsedNodes
        delete state.selection
        
        Ext.state.Manager.set(stateId, state)
    },


    uncheckAllExcept : function (testFile) {
        var me      = this
    
        Ext.each(this.testsStore.tree.flatten(), function (node) {
        
            if (node != testFile) me.setNodeChecked(node, false, true)
        })
    },
    
    buildContextMenu : function () {
        return new Ext.menu.Menu({
        
            renderTo    : Ext.getBody(),
        
            defaults    : {
                scope   : this
            },
        
            items       : [
                {
                    text        : 'Uncheck others (and check this)',
                    handler     : this.uncheckOthersHandler
                },
                {
                    text        : 'Uncheck all',
                    handler     : this.uncheckAllHandler
                },
                {
                    text        : 'Check all',
                    handler     : this.checkAllHandler
                },
                {
                    text        : 'Run this',
                    handler     : this.runThisFileHandler
                }
            ]
        })
    },


    uncheckOthersHandler : function () {
        var currentFile     = this.currentFile
    
        this.uncheckAllExcept(currentFile)
    
        this.setNodeChecked(currentFile, true)
    },


    runThisFileHandler : function () {
        this.harness.launch([ this.currentFile.get('descriptor') ])
    },


    uncheckAllHandler : function () {
        this.uncheckAllExcept()
    },


    checkAllHandler : function () {
        var me      = this
    
        Ext.each(this.testsStore.tree.flatten(), function (node) {
        
            me.setNodeChecked(node, true, true)
        })
    },


    onFilesContextMenu : function (view, testFile, el, index, event) {
        this.currentFile    = testFile

        if (!this.contextMenu) {
            this.contextMenu = this.buildContextMenu();
        }

        this.contextMenu.setPagePosition(event.getX(), event.getY())
    
        this.contextMenu.show();
    
        event.preventDefault();
    },


    onTestFileDoubleClick : function (view, testFile) {
        if (this.testsStore.isTreeFiltered() && !testFile.isLeaf()) {
            var childDesc       = []
            var nodeStore       = this.testsStore.nodeStore
            
            for (var i = nodeStore.indexOf(testFile) + 1; i < nodeStore.getCount(); i++) {
                var currentNode     = nodeStore.getAt(i)
                
                if (!currentNode.isAncestor(testFile)) break 
                
                if (currentNode.isLeaf()) childDesc.push(currentNode.get('descriptor'))
            }
            
            this.harness.launch(childDesc);
        } else 
            this.launchTest(testFile);
    },

    
    launchTest : function (testFile) {
        var resultPanel     = this.slots.resultPanel
        
        if (testFile.data.leaf && (testFile.get('test') == resultPanel.test || !resultPanel.test)) {
            // clear the content of the result panel, but only in case we are launching a currently shown test
            // (we could be also launching some other test)
            // assertions of the tests being launched will be cleared in the `onTestSuiteStart` method
            resultPanel.clear();
        }
        
        this.harness.launch([ testFile.get('descriptor') ])
    },

    
    updateStatusIndicator : function () {
        // can remain neutral if all files are missing for example
//        var isNeutral       = true
//        var allGreen        = true
//        var hasFailures     = false
    
        var totalPassed     = 0
        var totalFailed     = 0
    
        Joose.O.each(this.testsStore.tree.nodeHash, function (testFileRecord) {
            var test        = testFileRecord.get('test')
        
            // if there's at least one test - state is not neutral
            if (test && test.isFinished()) {
//                isNeutral       = false
            
//                allGreen        = allGreen      && test.isPassed()
//                hasFailures     = hasFailures   || test.isFailed()
            
                totalPassed     += test.getPassCount()
                totalFailed     += test.getFailCount()
            }
        })

        this.slots.filesTree.updateStatus(totalPassed, totalFailed);
    },

    onSettingsMenuBeforeShow : function(hdr, menu) {
        menu.down('[option=viewDOM]').setChecked(this.getOption('viewDOM'));
    },

    onMainButtonClick : function(hdr, button, action) {
        switch(action) {
            case 'run-checked':
                this.runChecked();
            break;
            case 'run-failed':
                this.runFailed();
            break;
            case 'run-all':
                this.runAll();
            break;
            case 'stop':
                this.stopSuite(button);
            break;
        }
    },
    
    rerunTest : function () {
        var toRun = this.slots.filesTree.getSelectionModel().getSelection()[ 0 ];
        
        if (toRun) {
            this.launchTest(toRun);
        }
    },

    afterRender : function() {
        this.callParent(arguments);

        Ext.getBody().createChild([
            {
                tag     : 'a',
                cls     : "logo-link",
                href    : "#",
                cn      : [{
                    tag     : 'img',
                    src     : Ext.BLANK_IMAGE_URL
                },
                {
                    tag  : 'span',
                    html : 'v.' + (Siesta.meta.VERSION || "1.0.0"),
                    cls  : 'tr-version-indicator'
                },
                {
                    tag  : 'div',
                    cls  : 'tr-progress-indicator'
                }]
            },
            {
                tag     : 'ul',
                cls     : "right-top-area",
                cn      : [
                    {
                        tag     : 'li',
                        html    : '<a id="bryntum-logo" href="http://bryntum.com/" target="_blank" class="bryntum-logo"></a>'
                    },
                    {
                        tag     : 'li',
                        style   : 'margin-top:3px',
                        html    : '<a href="http://bryntum.com/docs/siesta" target="_blank">API Documentation</a>'
                    }
                ]
            },

            {
                tag     : 'div',
                id      : 'update-ct'
            }
        ]);

        Ext.getBody().on({
            keyup : function(e,t) {
                if (e.getKey() === e.ENTER && e.ctrlKey) {
                    // TODO
                }
            }
        });
    },
    
    onHasSomeCoverageInfo : function () {
        this.slots.filesTree.enableCoverageButton();
    },
    
    onNoCoverageInfo : function () {
        this.slots.filesTree.disableCoverageButton()
    },

    showCoverageReport : function () {
        var resultPanel                 = this.slots.resultPanel
        var coverageReport              = this.slots.coverageReport
        
        coverageReport.loadHtmlReport(this.harness.generateCoverageHtmlReport(false));

        if (this.slots.center.getLayout().getActiveItem() === this.slots.resultPanel) {
            this.slots.resultPanel.hideIFrame()

            this.slots.center.getLayout().setActiveItem(1)
        } else {
            this.showMainUI();
        }
    },

    showMainUI: function () {
        this.slots.center.getLayout().setActiveItem(0)
        
        this.slots.resultPanel.alignIFrame()
    }
})
//eof Siesta.Harness.Browser.UI.Viewport
