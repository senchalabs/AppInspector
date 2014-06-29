What is code coverage?
-----

Code coverage provides information about what parts of your codebase are exercised when running your test suite.
In other words, it describes what parts of your codebase that's "covered" with tests - such code can be considered "safe".
Code that isn't executed by your suite should be treated as "unsafe" and a potential source of bugs.

Keep in mind though, good code coverage in itself doesn't mean that the code functions correctly. "Covered" code can still produce wrong
results, due to algorithmic or logical errors. The main assurance provided by "covered" code is that it won't throw unexpected exceptions.

Code coverage data is very valuable information, which will tell you what parts of your codebase that need more tests. If you detect that core classes of your application
aren't being exercised by any test, this should be a clear call-to-action!

In order to collect the code coverage information, your codebase is _instrumented_ by Siesta (transformed into different
code). The instrumented version collects data about every statement, line, branch and function and reports how many times it is executed. Siesta is using the awesome [Istanbul](http://gotwarlost.github.io/istanbul/)
library for this purpose.

For example if your file contains only one assignment:

    var a = 1;
    
It will be instrumented to:

    if (typeof __coverage__ === 'undefined') { __coverage__ = {}; }
    if (!__coverage__['filename.js']) {
       __coverage__['filename.js'] = {"path":"filename.js","s":{"1":0},"b":{},"f":{},"fnMap":{},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}},"branchMap":{}};
    }
    var __cov_1 = __coverage__['filename.js'];
    __cov_1.s['1']++;var a=1;

As you can see the amount of code increases and as a result instrumented code will take longer time to execute.
Apart from this, the instrumentation process is unobtrusive and does not change the semantic of the original code.

## Enabling code coverage

To enable the code coverage module, just set the {@link Siesta.Harness.Browser.ExtJS#enableCodeCoverage "enableCodeCoverage : true"}
option to your harness:

    Harness.configure({
        enableCodeCoverage      : true
    })
    
Additionally, you must also include the "siesta-coverage-all.js" file on your harness page **after** the regular siesta-all.js file:

    <script type="text/javascript" src="../siest-all.js"></script>
    <script type="text/javascript" src="../siesta-coverage-all.js"></script>

Please refer to the "/examples/code_coverage.html" file from the Siesta package for a sample setup.

Siesta will only instrument files marked explicitly in your `preload` config. To mark a file for instrumentation, add a
`instrument : true` config to the file's {@link Siesta.Harness.Browser.ExtJS#preload preload descriptor}:

    Harness.configure({
        preload         : [
            {
                type        : 'js',  // optional if file ends with ".js"
                url         : 'some_file.js',
                instrument  : true
            }
        ],
        ...
    })

Additionally, when using the Ext JS testing layer, Siesta will install an on-the-fly instrumentation hook into the `Ext.Loader` code.
Please refer to the documentation for {@link Siesta.Harness.Browser.ExtJS#installLoaderInstrumentationHook installLoaderInstrumentationHook} config
and {@link Siesta.Harness.Browser.ExtJS#getLoaderInstrumentationHook getLoaderInstrumentationHook} method.

## Coverage units

On the generic browser level, Siesta collects code coverage information on a per file basis (the coverage unit is a "file").

However, in web-development it's common to concatenate several JavaScript files
(each file usually containing one class) into a single big bundle file. Getting file coverage for such a "bundle" will be very useful, since it can be huge
and if you will want to check the coverage for a specific class in the bundle you will have to search/scroll a lot.

When using the Ext JS testing layer, Siesta can collect coverage information on a **per Ext JS class** basis (coverage unit is "extjs_class"). In this mode,
Siesta looks for `Ext.define()` calls in the source files, and extracts the class definitions and instruments only the extracted parts.

The resulting report in this mode will contain information about classes, not files. This mode can be set with the
{@link Siesta.Harness.Browser.ExtJS#coverageUnit coverageUnit} config of the harness.

Additionally, Siesta allows you to define what coverage units to include/exclude from instrumentation. By default, on the generic browser level,
everything is included and nothing is excluded. Using the Ext JS layer, everything is included and framework classes starting with "Ext" are excluded.
Please refer to {@link Siesta.Harness.Browser.ExtJS#includeCoverageUnits includeCoverageUnits} and 
{@link Siesta.Harness.Browser.ExtJS#excludeCoverageUnits excludeCoverageUnits} config options.

## Automation

Gathering code coverage information should naturally also be part of any Continuous Integration process.

Siesta provides a command line interface that can be automated using PhantomJS or WebDriver. Please refer to this guide
for details: <a href="#!/guide/siesta_automation">Siesta automation. Continuous Integration</a>. Here we'll just quickly cover
the command-line options related to coverage reports.

- `--coverage-report-format` - this option enables code coverage and specifies the format of the code coverage report.
Recognized values are `html`, `lcov` or `raw`. This option can be repeated several times, resulting in several reports
saved in the same directory. Alternatively, several formats can be concatenated with "," or "+": `--coverage-report-format=html+raw`

"Html" report is a simple visualization of the coverage information in the form of a web page. "Lcov" is a format
to be consumed by the [`lcov`](http://ltp.sourceforge.net/coverage/lcov.php) tool and "raw" is a format that generally should
be used only for the "--previous-coverage-report" option (see below).   

- `--coverage-report-dir` - optional. Specifies the output directory for the code coverage report, default value is "./coverage/" 
 
- `--coverage-unit` - optional. If provided, overrides the value of the {@link Siesta.Harness.Browser.ExtJS#coverageUnit coverageUnit} config of the harness.
Otherwise the value from the harness file is used.

- `--previous-coverage-report` - optional. If provided, should point to the previously generated "raw" report (either to the json file or directory).
Coverage information from that report will be combined with the current session. Use this option if you need to combine
the coverage information from different browsers.

These options are the same for both the PhantomJS and WebDriver launchers.

If you require a JSON report from the coverage data, one can be obtained by using the "html" option. Along with the HTML report you'll find a
file names coverage-data.json. **NOTE** This file is generated by Istanbul and its JSON structure is not guaranteed to be stable as we update the Istanbul version used by
Siesta. Below is a sample of the produced JSON file:

    {
        "htmlReport"   : {
            "prefix" : [

            ],
            "root"   : {
                "name"     : "My",
                "fullName" : "My",
                "kind"     : "dir",
                "metrics"  : {
                    "lines"      : {
                        "total"   : 20,
                        "covered" : 13,
                        "pct"     : 65
                    },
                    "statements" : {
                        "total"   : 23,
                        "covered" : 14,
                        "pct"     : 60.87
                    },
                    "functions"  : {
                        "total"   : 8,
                        "covered" : 4,
                        "pct"     : 50
                    },
                    "branches"   : {
                        "total"   : 6,
                        "covered" : 3,
                        "pct"     : 50
                    }
                },
                "parent"   : null,
                "children" : [
                    {
                        "name"         : "My/Model",
                        "relativeName" : "Model",
                        "fullName"     : "My/Model",
                        "kind"         : "dir",
                        "metrics"      : {
                            "lines"      : {
                                "total"   : 15,
                                "covered" : 9,
                                "pct"     : 60
                            },
                            "statements" : {
                                "total"   : 18,
                                "covered" : 10,
                                "pct"     : 55.56
                            },
                            "functions"  : {
                                "total"   : 6,
                                "covered" : 3,
                                "pct"     : 50
                            },
                            "branches"   : {
                                "total"   : 6,
                                "covered" : 3,
                                "pct"     : 50
                            }
                        },
                        "parent"       : "My",
                        "children"     : [
                            {
                                "name"         : "My/Model/Employee",
                                "relativeName" : "Employee",
                                "fullName"     : "My/Model/Employee",
                                "kind"         : "file",
                                "metrics"      : {
                                    "lines"      : {
                                        "total"   : 2,
                                        "covered" : 1,
                                        "pct"     : 50
                                    },
                                    "statements" : {
                                        "total"   : 2,
                                        "covered" : 1,
                                        "pct"     : 50
                                    },
                                    "functions"  : {
                                        "total"   : 1,
                                        "covered" : 0,
                                        "pct"     : 0
                                    },
                                    "branches"   : {
                                        "total"   : 0,
                                        "covered" : 0,
                                        "pct"     : 100
                                    }
                                },
                                "parent"       : "My/Model",
                                "children"     : [

                                ],
                                "html"         : "<pre class=\"coverage\"><table class=\"coverage\"><tr><td class=\"line-count\">1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12</td><td class=\"line-coverage\"><span class=\"cline-any cline-yes\">2</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-no\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span></td><td class=\"text\"><pre class=\"prettyprint lang-js\">Ext.define('My.Model.Employee', {\n    extend          : 'My.Model.Resource',\n    \n    fields          : [\n        'HourlyRate'\n    ],\n    \n    \n    calculateSalary : <span class=\"fstat-no\" title=\"function not covered\" >function (startDate, endDate) {</span>\n<span class=\"cstat-no\" title=\"statement not covered\" >        return this.get('Salary') * (endDate - startDate) / 1000 * 60 * 60</span>\n    }\n})</pre></td></tr></table></pre>\n"
                            },
                            {
                                "name"         : "My/Model/Event",
                                "relativeName" : "Event",
                                "fullName"     : "My/Model/Event",
                                "kind"         : "file",
                                "metrics"      : {
                                    "lines"      : {
                                        "total"   : 2,
                                        "covered" : 2,
                                        "pct"     : 100
                                    },
                                    "statements" : {
                                        "total"   : 2,
                                        "covered" : 2,
                                        "pct"     : 100
                                    },
                                    "functions"  : {
                                        "total"   : 1,
                                        "covered" : 1,
                                        "pct"     : 100
                                    },
                                    "branches"   : {
                                        "total"   : 0,
                                        "covered" : 0,
                                        "pct"     : 100
                                    }
                                },
                                "parent"       : "My/Model",
                                "children"     : [

                                ],
                                "html"         : "<pre class=\"coverage\"><table class=\"coverage\"><tr><td class=\"line-count\">1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13</td><td class=\"line-coverage\"><span class=\"cline-any cline-yes\">3</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-yes\">1</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span></td><td class=\"text\"><pre class=\"prettyprint lang-js\">Ext.define('My.Model.Event', {\n        extend          : 'My.Model.Range',\n        \n        fields          : [\n            'ResourceId',\n            'Type'\n        ],\n        \n        \n        getType : function () {\n            return this.get('Type')\n        }\n    }) </pre></td></tr></table></pre>\n"
                            },
                            {
                                "name"         : "My/Model/Range",
                                "relativeName" : "Range",
                                "fullName"     : "My/Model/Range",
                                "kind"         : "file",
                                "metrics"      : {
                                    "lines"      : {
                                        "total"   : 5,
                                        "covered" : 5,
                                        "pct"     : 100
                                    },
                                    "statements" : {
                                        "total"   : 7,
                                        "covered" : 6,
                                        "pct"     : 85.71
                                    },
                                    "functions"  : {
                                        "total"   : 2,
                                        "covered" : 2,
                                        "pct"     : 100
                                    },
                                    "branches"   : {
                                        "total"   : 4,
                                        "covered" : 3,
                                        "pct"     : 75
                                    }
                                },
                                "parent"       : "My/Model",
                                "children"     : [

                                ],
                                "html"         : "<pre class=\"coverage\"><table class=\"coverage\"><tr><td class=\"line-count\">1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22</td><td class=\"line-coverage\"><span class=\"cline-any cline-yes\">3</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-yes\">2</span>\n<span class=\"cline-any cline-yes\">1</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-yes\">1</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-yes\">1</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span></td><td class=\"text\"><pre class=\"prettyprint lang-js\">Ext.define('My.Model.Range', {\n    extend          : 'Ext.data.Model',\n    \n    fields          : [\n        'StartDate', 'EndDate'\n    ],\n    \n    \n    getStartDate : function (format) {\n        if (format)\n            return Ext.Date.format(this.get('StartDate'), format)\n        else\n            return this.get('StartDate')\n    },\n    \n    \n    // istanbul provides statement-level coverage, so several statements on the same line is fine\n    getEndDate : function (format) {\n        <span class=\"missing-if-branch\" title=\"if path not taken\"\" >I</span>if (format) { <span class=\"cstat-no\" title=\"statement not covered\" >return Ext.Date.format(this.get('EndDate')) }</span> else { return this.get('EndDate') }\n    }\n})\n&nbsp;</pre></td></tr></table></pre>\n"
                            },
                            {
                                "name"         : "My/Model/Resource",
                                "relativeName" : "Resource",
                                "fullName"     : "My/Model/Resource",
                                "kind"         : "file",
                                "metrics"      : {
                                    "lines"      : {
                                        "total"   : 6,
                                        "covered" : 1,
                                        "pct"     : 16.67
                                    },
                                    "statements" : {
                                        "total"   : 7,
                                        "covered" : 1,
                                        "pct"     : 14.29
                                    },
                                    "functions"  : {
                                        "total"   : 2,
                                        "covered" : 0,
                                        "pct"     : 0
                                    },
                                    "branches"   : {
                                        "total"   : 2,
                                        "covered" : 0,
                                        "pct"     : 0
                                    }
                                },
                                "parent"       : "My/Model",
                                "children"     : [

                                ],
                                "html"         : "<pre class=\"coverage\"><table class=\"coverage\"><tr><td class=\"line-count\">1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23</td><td class=\"line-coverage\"><span class=\"cline-any cline-yes\">2</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-no\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-no\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-no\">&nbsp;</span>\n<span class=\"cline-any cline-no\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-no\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span></td><td class=\"text\"><pre class=\"prettyprint lang-js\">Ext.define('My.Model.Resource', {\n    extend          : 'Ext.data.Model',\n    \n    eventsStore     : null,\n    \n    fields          : [\n        'Name',\n        'Duration'\n    ],\n    \n    \n    getEvents : <span class=\"fstat-no\" title=\"function not covered\" >function () {</span>\n<span class=\"cstat-no\" title=\"statement not covered\" >        var id      = this.getId()</span>\n        \n<span class=\"cstat-no\" title=\"statement not covered\" >        var events  = []</span>\n        \n<span class=\"cstat-no\" title=\"statement not covered\" >        this.eventsStore(<span class=\"fstat-no\" title=\"function not covered\" >function (event) {</span></span>\n<span class=\"cstat-no\" title=\"statement not covered\" >            if (event.get('ResourceId') == id) <span class=\"cstat-no\" title=\"statement not covered\" >events.push(event)</span></span>\n        })\n        \n<span class=\"cstat-no\" title=\"statement not covered\" >        return events</span>\n    }\n})</pre></td></tr></table></pre>\n"
                            }
                        ]
                    },
                    {
                        "name"         : "My/Store",
                        "relativeName" : "Store",
                        "fullName"     : "My/Store",
                        "kind"         : "dir",
                        "metrics"      : {
                            "lines"      : {
                                "total"   : 4,
                                "covered" : 3,
                                "pct"     : 75
                            },
                            "statements" : {
                                "total"   : 4,
                                "covered" : 3,
                                "pct"     : 75
                            },
                            "functions"  : {
                                "total"   : 2,
                                "covered" : 1,
                                "pct"     : 50
                            },
                            "branches"   : {
                                "total"   : 0,
                                "covered" : 0,
                                "pct"     : 100
                            }
                        },
                        "parent"       : "My",
                        "children"     : [
                            {
                                "name"         : "My/Store/Base",
                                "relativeName" : "Base",
                                "fullName"     : "My/Store/Base",
                                "kind"         : "file",
                                "metrics"      : {
                                    "lines"      : {
                                        "total"   : 2,
                                        "covered" : 1,
                                        "pct"     : 50
                                    },
                                    "statements" : {
                                        "total"   : 2,
                                        "covered" : 1,
                                        "pct"     : 50
                                    },
                                    "functions"  : {
                                        "total"   : 1,
                                        "covered" : 0,
                                        "pct"     : 0
                                    },
                                    "branches"   : {
                                        "total"   : 0,
                                        "covered" : 0,
                                        "pct"     : 100
                                    }
                                },
                                "parent"       : "My/Store",
                                "children"     : [

                                ],
                                "html"         : "<pre class=\"coverage\"><table class=\"coverage\"><tr><td class=\"line-count\">1\n2\n3\n4\n5\n6\n7\n8\n9</td><td class=\"line-coverage\"><span class=\"cline-any cline-yes\">1</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-no\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span></td><td class=\"text\"><pre class=\"prettyprint lang-js\">Ext.define('My.Store.Base', {\n        extend          : 'Ext.data.Store',\n        \n        requires        : [ 'My.Util.SomeClass' ],\n        \n        someMethod : <span class=\"fstat-no\" title=\"function not covered\" >function () {</span>\n<span class=\"cstat-no\" title=\"statement not covered\" >            return 'value'</span>\n        }\n    }) </pre></td></tr></table></pre>\n"
                            },
                            {
                                "name"         : "My/Store/EventStore",
                                "relativeName" : "EventStore",
                                "fullName"     : "My/Store/EventStore",
                                "kind"         : "file",
                                "metrics"      : {
                                    "lines"      : {
                                        "total"   : 2,
                                        "covered" : 2,
                                        "pct"     : 100
                                    },
                                    "statements" : {
                                        "total"   : 2,
                                        "covered" : 2,
                                        "pct"     : 100
                                    },
                                    "functions"  : {
                                        "total"   : 1,
                                        "covered" : 1,
                                        "pct"     : 100
                                    },
                                    "branches"   : {
                                        "total"   : 0,
                                        "covered" : 0,
                                        "pct"     : 100
                                    }
                                },
                                "parent"       : "My/Store",
                                "children"     : [

                                ],
                                "html"         : "<pre class=\"coverage\"><table class=\"coverage\"><tr><td class=\"line-count\">1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11</td><td class=\"line-coverage\"><span class=\"cline-any cline-yes\">1</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-yes\">1</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span></td><td class=\"text\"><pre class=\"prettyprint lang-js\">Ext.define('My.Store.EventStore', {\n    extend          : 'My.Store.Base',\n    \n    model           : 'My.Model.Event',\n    \n    proxy           : 'memory',\n    \n    someMethod : function () {\n        return 'value'\n    }\n}) </pre></td></tr></table></pre>\n"
                            }
                        ]
                    },
                    {
                        "name"         : "My/Util",
                        "relativeName" : "Util",
                        "fullName"     : "My/Util",
                        "kind"         : "dir",
                        "metrics"      : {
                            "lines"      : {
                                "total"   : 1,
                                "covered" : 1,
                                "pct"     : 100
                            },
                            "statements" : {
                                "total"   : 1,
                                "covered" : 1,
                                "pct"     : 100
                            },
                            "functions"  : {
                                "total"   : 0,
                                "covered" : 0,
                                "pct"     : 100
                            },
                            "branches"   : {
                                "total"   : 0,
                                "covered" : 0,
                                "pct"     : 100
                            }
                        },
                        "parent"       : "My",
                        "children"     : [
                            {
                                "name"         : "My/Util/SomeClass",
                                "relativeName" : "SomeClass",
                                "fullName"     : "My/Util/SomeClass",
                                "kind"         : "file",
                                "metrics"      : {
                                    "lines"      : {
                                        "total"   : 1,
                                        "covered" : 1,
                                        "pct"     : 100
                                    },
                                    "statements" : {
                                        "total"   : 1,
                                        "covered" : 1,
                                        "pct"     : 100
                                    },
                                    "functions"  : {
                                        "total"   : 0,
                                        "covered" : 0,
                                        "pct"     : 100
                                    },
                                    "branches"   : {
                                        "total"   : 0,
                                        "covered" : 0,
                                        "pct"     : 100
                                    }
                                },
                                "parent"       : "My/Util",
                                "children"     : [

                                ],
                                "html"         : "<pre class=\"coverage\"><table class=\"coverage\"><tr><td class=\"line-count\">1\n2</td><td class=\"line-coverage\"><span class=\"cline-any cline-yes\">1</span>\n<span class=\"cline-any cline-neutral\">&nbsp;</span></td><td class=\"text\"><pre class=\"prettyprint lang-js\">Ext.define('My.Util.SomeClass', {\n}) </pre></td></tr></table></pre>\n"
                            }
                        ]
                    }
                ]
            }
        },
        "coverageUnit" : "extjs_class"
    }

Buy this product
---------

Visit our store: <http://bryntum.com/store/siesta>


Support
---------

Ask a question in our community forum: <http://www.bryntum.com/forum/viewforum.php?f=20>

Share your experience in our IRC channel: [#bryntum](http://webchat.freenode.net/?randomnick=1&channels=bryntum&prompt=1)

Please report any bugs through the web interface at <https://www.assembla.com/spaces/bryntum/support/tickets>


See also
---------

Web page of this product: <http://bryntum.com/products/siesta>

Other Bryntum products: <http://bryntum.com/products>

Attribution
---------

This software contains icons from the following icon packs (licensed under Creative Common 2.5/3.0 Attribution licenses)

- <http://www.famfamfam.com/lab/icons/silk/>
- <http://led24.de/iconset/>
- <http://p.yusukekamiyamane.com/>
- <http://rrze-icon-set.berlios.de/index.html>
- <http://www.smashingmagazine.com/2009/05/20/flavour-extended-the-ultimate-icon-set-for-web-designers/>
- <http://www.doublejdesign.co.uk/products-page/icons/super-mono-icons/>
- <http://pixel-mixer.com/>

Thanks a lot to the authors of the respective icons packs.


COPYRIGHT AND LICENSE
---------

Copyright (c) 2009-2013, Bryntum & Nickolay Platonov

All rights reserved.