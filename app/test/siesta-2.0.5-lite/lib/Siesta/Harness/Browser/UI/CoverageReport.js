/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.CoverageReport', {
    extend                  : 'Ext.Container',
    alias                   : 'widget.coveragereport',

    requires                : ['Ext.chart.Chart'],
    cls                     : 'st-cov-report-panel',
    layout                  : 'border',

    htmlReport              : null,
    
    treeStore               : null,

    chart                   : null,
    sourcePanel             : null,
    contentContainer        : null,
    toggleButtons           : null,
    
    standalone              : false,
    dataUrl                 : null,
    border                  : true,

    // Number of levels in the coverage class/file tree to expand by default
    expandLevels            : 2,

    initComponent : function() {
        var me              = this
        var standalone      = this.standalone
        
        var store           = this.treeStore = new Siesta.Harness.Browser.Model.FilterableTreeStore({
            model       : 'Siesta.Harness.Browser.Model.CoverageUnit',
            proxy       : 'memory',
            rootVisible : true
        })        
        
        Ext.apply(this, {

            items       : [
                {
                    xtype                   : 'treepanel',
                    region                  : 'west',
                    enableColumnHide        : false,
                    enableColumnMove        : false,
                    enableColumnResize      : false,
                    sortableColumns         : false,
                    rowLines                : false,
                    tbar                    : {
                        height : 42,
                        border : false,
                        items : [
                            standalone ? null : {
                                text            : 'Close',
                                cls             : 'light-button',
                                height          : 26,
                                style           : 'border-color:#bbb;margin:0 5px;',
                                handler         : this.onBackToMainUI,
                                scope           : this
                            },
                            {
                                xtype           : 'treefilter',
                                cls             : 'filterfield',
                                hasAndCheck         : function () {
                                    var states      = Ext.pluck(me.toggleButtons, 'pressed')

                                    return !states[ 0 ] || !states[ 1 ] || !states[ 2 ]
                                },
                                andChecker          : this.levelFilter,
                                andCheckerScope     : this,

                                store           : store,
                                filterField     : 'text',
                                trigger1Cls     : 'icon-close',
                                triggerLeafCls  : 'icon-file-2',
                                triggerGroupCls : 'icon-folder',
                                width           : 180
                            },
                            '->',
                            {
                                xtype           : 'label',
                                text            : 'Show :',
                                margin          : '0 5 0 0'
                            },
                            {
                                text            : 'High',
                                level           : 'high',
                                enableToggle    : true,
                                pressed         : true,
                                cls             : 'st-cov-level-high',
                                toggleHandler   : this.toggleLevels,
                                scope           : this,
                                margin          : '0 5 0 0'
                            },
                            {
                                text            : 'Med',
                                level           : 'med',
                                enableToggle    : true,
                                pressed         : true,
                                cls             : 'st-cov-level-medium',
                                toggleHandler   : this.toggleLevels,
                                scope           : this,
                                margin          : '0 5 0 0'
                            },
                            {
                                text            : 'Low',
                                level           : 'low',
                                enableToggle    : true,
                                pressed         : true,
                                cls             : 'st-cov-level-low',
                                toggleHandler   : this.toggleLevels,
                                scope           : this,
                                style           : 'margin:0 5px 0 0'
                            }
                        ]
                    },
                    
                    viewType    : 'filterabletreeview',
                    viewConfig  : {
                        store           : store.nodeStore,
                        trackOver       : false,
                        rootVisible     : true
                    },
                    
                    cls         : 'st-cov-report-tree-panel',
                    
                    flex        : 1,
                    split       : true,
                    rootVisible : true,
                    
                    columns     : [
                        {
                            xtype           : 'treecolumn',
                            dataIndex       : 'text',
                            menuDisabled    : true,
                            flex            : 3
                        },
                        {
                            text            : 'Statements',
                            flex            : 1,
                            menuDisabled    : true,
                            tdCls           : 'cov-result-cell',
                            renderer        : this.getMetricsRenderer('statements')
                        },
                        {
                            text            : 'Branches',
                            flex            : 1,
                            menuDisabled    : true,
                            tdCls           : 'cov-result-cell',
                            renderer        : this.getMetricsRenderer('branches')
                        },
                        {
                            text            : 'Functions',
                            flex            : 1,
                            menuDisabled    : true,
                            tdCls           : 'cov-result-cell',
                            renderer        : this.getMetricsRenderer('functions')
                        },
                        {
                            text            : 'Lines',
                            flex            : 1,
                            menuDisabled    : true,
                            tdCls           : 'cov-result-cell',
                            renderer        : this.getMetricsRenderer('lines')
                        }
                    ],
                    
                    store       : store,
                    
                    listeners   : {
                        itemclick       : this.onTestFileClick,
                        scope           : this
                    }
                },
                {
                    xtype       : 'container',
                    slot        : 'contentContainer',
                    region      : 'center',
                    layout      : 'card',
                    style       : 'background:#fff',

                    items       : [
                        this.createChart(),
                        {
                            xtype       : 'panel',
                            slot        : 'sourcePanel',
                            
                            flex        : 1,
                            autoScroll  : true,
                            bodyPadding : '4 0 4 10',
                            border      : false,
                            cls         : 'st-cov-report-source-panel'
                        }
                    ]
                    
                }
            ]
        })
        
        this.callParent()
        
        this.contentContainer   = this.down('[slot=contentContainer]')
        this.chart              = this.down('chart')
        this.sourcePanel        = this.down('[slot=sourcePanel]')
        this.toggleButtons      = this.query('button[level]')
        
        if (standalone) {
            // `loadingMask.show()` throws exception when called with non-rendered target
            this.on('afterrender', function () {
                var loadingMask = new Ext.LoadMask({ target : this, msg : "Loading coverage data..." });
                
                loadingMask.show()

//                use this code for testing
//                setTimeout(function () {
//                    loadingMask.hide()
//                    
//                    me.loadHtmlReport(me.htmlReport)
//                }, 2000)
                
                Ext.Ajax.request({
                    url             : this.dataUrl,
                    
                    success         : function (response) {
                        loadingMask.hide()
                        me.loadHtmlReport(Ext.JSON.decode(response.responseText))
                    },
                    
                    failure         : function () {
                        loadingMask.hide()
                        Ext.Msg.show({
                            title           : 'Loading error',
                            msg             : 'Could not load the report data from this url: ' + me.dataUrl,
                            buttons         : Ext.MessageBox.OK,
                            icon            : Ext.MessageBox.ERROR
                        }) 
                    }
                })
            }, this, { single : true })
        } else if (this.htmlReport) {
            this.loadHtmlReport(this.htmlReport);
        }
    },
    
    
    loadHtmlReport : function (report) {
        this.htmlReport         = report
        
        var treeStore           = this.treeStore
        var isFile              = report.coverageUnit == 'file'
        var treeFilter          = this.down('treefilter')

        treeStore.setRootNode(this.generateFilesTree(report.htmlReport.root))

        this.down('treecolumn').setText(isFile ? 'File name' : 'Class name')

        treeFilter.emptyText    = isFile ? 'Filter files' : 'Filter classes'
        
        treeFilter.applyEmptyText();

        this.loadChartData(treeStore.getRootNode());
    },
    
    
    levelFilter : function (node) {
        var coverage = node.getStatementCoverage();

        if (coverage === undefined) return false;
        
        return this.toggleButtons[ coverage >= 80 ? 0 : coverage >= 50 ? 1 : 2 ].pressed
    },
    
    
    toggleLevels : function () {
        this.down('treefilter').refreshFilter()
    },
    
    
    getCoverageLevelClass : function (coveragePct) {
        if (typeof coveragePct == 'number')
            return 'st-cov-level-' + (coveragePct >= 80 ? 'high' : coveragePct >= 50 ? 'medium' : 'low');
        else
            return ''
    },
    
    
    getMetricsRenderer : function (property) {
        var me              = this
        
        return function (value, metaData, preloadFile) {
            var reportNode  = preloadFile.get('reportNode')
            if (!reportNode) return ''
            
            var metrics     = reportNode.metrics[ property ]
            
            metaData.tdCls  = me.getCoverageLevelClass(metrics.pct)
            
            return '<span class="st-cov-stat-pct-' + property + '">' + Math.round(metrics.pct) + '%</span> ' +
                '<span class="st-cov-stat-abs-' + property + '">(' + metrics.covered + '/' + metrics.total + ')</span>'
        }        
    },
    

    generateFilesTree : function (node, depth) {
        var me          = this
        depth           = depth || 0;

        // in this method "node" should be treated as the raw JSON object and not the instance of Node from Istanbul
        // (even that in UI usage scenario it will be a Node)
        // since for standalone report we load a JSON blob with the tree report
        // so should not call any methods on "node"
        if (node.kind == 'dir') {
            var text    = node.relativeName || node.fullName

            return {
                id              : node.fullName,
                url             : node.fullName,
                leaf            : false,
                expanded        : depth < this.expandLevels,
                
                text            : text == '/' && this.htmlReport.coverageUnit == 'extjs_class' ? '[Global namespace]' : text,
                
                reportNode      : node,
                
                children        : Ext.Array.map(node.children, function (childNode) {
                    return me.generateFilesTree(childNode, depth+1)
                }).sort(this.treeSorterFn)
            }
        } else {
            return {
                id              : node.fullName,
                url             : node.fullName,
                leaf            : true,
                
                text            : node.relativeName,
                
                reportNode      : node
            }
        }
    },

    treeSorterFn : function(node1, node2) {
        if (!node1.leaf && node2.leaf) return -1;

        if (node1.leaf && !node2.leaf) return 1;

        if (node1.leaf === node2.leaf) return node1.text < node2.text ? -1 : 1;
    },

    onTestFileClick : function (view, record, nodeEl) {
        if (record.isLeaf()) {
            this.sourcePanel.update(record.get('reportNode').html)
            prettyPrint()
            this.contentContainer.getLayout().setActiveItem(1)
        } else {
            this.loadChartData(record)
            this.contentContainer.getLayout().setActiveItem(0)
        }
    },
    
    
    onBackToMainUI : function () {
        this.fireEvent('backtomainui', this)
    },
    
    
    loadChartData : function (node) {
        this.chart.store.loadData([
            { name : 'Statements', value : Math.round(node.getStatementCoverage()) },
            { name : 'Branches', value : Math.round(node.getBranchCoverage()) },
            { name : 'Functions', value : Math.round(node.getFunctionCoverage()) },
            { name : 'Lines', value : Math.round(node.getLineCoverage()) }
        ])
    },
    

    createChart : function() {
        var colors  = [ 'url(#v-1)', 'url(#v-2)', 'url(#v-3)', 'url(#v-4)', 'url(#v-5)'];
        var font    = '13px Source Sans Pro, sans-serif';

        var chart = new Ext.chart.Chart({
            margin          : '35% 35%',
            animate         : {
                easing      : 'bounceOut',
                duration    : 800
            },
            store: new Ext.data.JsonStore({
                fields : ['name', 'value']
            }),

            gradients: [
                {
                    'id'    : 'v-1',
                    'angle' : 0,
                    stops   : {
                        0: {
                            color: 'rgb(212, 40, 40)'
                        },
                        100: {
                            color: 'rgb(188, 35, 35)'
                        }
                    }
                },
                {
                    'id'    : 'v-2',
                    'angle' : 0,
                    stops   : {
                        0: {
                            color: 'rgb(180, 216, 42)'
                        },
                        100: {
                            color: 'rgb(168, 185, 35)'
                        }
                    }
                },
                {
                    'id'    : 'v-3',
                    'angle' : 0,
                    stops   : {
                        0: {
                            color: 'rgb(43, 221, 115)'
                        },
                        100: {
                            color: 'rgb(33, 190, 100)'
                        }
                    }
                },
                {
                    'id'    : 'v-4',
                    'angle' : 0,
                    stops   : {
                        0: {
                            color: 'rgb(45, 117, 226)'
                        },
                        100: {
                            color: 'rgb(38, 104, 190)'
                        }
                    }
                }],
            axes: [{
                type        : 'Numeric',
                position    : 'left',
                fields      : ['value'],
                minimum     : 0,
                maximum     : 100,
                label       : {
                    renderer: Ext.util.Format.numberRenderer('0'),
                    fill    : '#555',
                    font    : font
                },
                grid: {
                    odd: {
                        stroke: '#efefef'
                    },
                    even: {
                        stroke: '#efefef'
                    }
                }
            }, {
                type        : 'Category',
                position    : 'bottom',
                fields      : ['name'],
                label       : {
                    fill    : '#555',
                    font    : font
                }
            }],
            series: [{
                type    : 'column',
                axis    : 'left',
                label   : {
                    display         : 'outside',
                    'text-anchor'   : 'middle',
                    field           : 'value',
                    orientation     : 'horizontal',
                    fill            : '#aaa',
                    font            : font,
                    renderer: function(value, label, storeItem, item, i, display, animate, index) {
                        return value + '%';
                    }
                },
                renderer: function(sprite, storeItem, barAttr, i, store) {
                    barAttr.fill = colors[i % colors.length];
                    return barAttr;
                },
                yField: 'value'
            }]
        });

        return chart
    }
});


// Override to allow report to fetch the data from file system
// http://www.sencha.com/forum/showthread.php?10621-Why-Ajax-can-not-get-local-file-while-prototypejs-can&s=3ce6b6ad58be217b173c3b31b8f0ad5d
Ext.data.Connection.override({

    parseStatus : function (status) {
        var result = this.callOverridden(arguments);
        if (status === 0) {
            result.success = true;
        }
        return result;
    }
});