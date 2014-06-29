Description
-----------

Siesta is a stree-free JavaScript unit testing tool. It is known that change of activity is a form of rest,
so stop writing code, write some tests and have some rest! Your application will win from both.

Siesta is very easy to learn and as your test suite grows and your requirements becomes more complex it still scales very well. 

Siesta is also cross-platform - the same tests can run in browsers and NodeJS (assuming of course they are written in a platform-independent manner).

{@img images/demo.png}


About this document
-------------------

This document is a complete manual, covering most use cases and details about using Siesta. There is no need to read it in full when you're starting out - 
read as much as you need to get started and return here when you feel you need information about some additional use case/feature.

Although most of the examples use the Ext JS library, Siesta is a general-purpose testing library - it can test any code. 

Requirements
------------

To run tests that use XHR requests reliably across all browsers, you will need to use a local web server on your machine.


Getting started
---------

Start by creating a directory for your tests, let's say it will be "/yourproject/tests". Make it available via HTTP as for example
"http://localhost/yourproject/tests". 

Now you will need a harness file. Harness is a kind of dashboard, which sets up the environment for each test and collects the results.
Lets name it "index.js" and put this code in it:

    var Harness = Siesta.Harness.Browser.ExtJS;
    
    Harness.configure({
        title       : 'Awesome Test Suite',
        
        preload     : [
            // version of ExtJS used by your application
            '../ext-4.1.1/resources/css/ext-all.css',
            '../resources/yourproject-css-all.css',
            
            // version of ExtJS used by your application
            '../ext-4.1.1/ext-all-debug.js',
            '../yourproject-all.js'
        ]
    });
    
    Harness.start(
        '010_sanity.t.js',
        '020_basic.t.js'
    );

Here we are configuring the harness to run 2 tests: `010_sanity.t.js` and `020_basic.t.js`. Each test will be run in **its own**, completely **isolated** and **clean** global 
scope. **There is no need to cleanup anything**. The `preload` option specifies what files should be loaded prior each test.

**All paths are relative to the harness file - `index.html`**

Now lets create an "index.html" file and include a link to "index.js" in it" ` (this step is optional for the NodeJS platform):
    
	<!DOCTYPE html>
    <html>
        <head>
            <!-- Siesta UI must use ExtJS 4.2.0 (you can specify any other ExtJS version in your "preload" config) -->
            <link rel="stylesheet" type="text/css" href="http://cdn.sencha.io/ext-4.2.0-gpl/resources/css/ext-all.css">
            <link rel="stylesheet" type="text/css" href="__path_to_siesta__/resources/css/siesta-all.css">
            
            <!-- Siesta UI must use ExtJS 4.2.0 (you can specify any other ExtJS version in your "preload" config) -->
            <script type="text/javascript" src="http://cdn.sencha.io/ext-4.2.0-gpl/ext-all.js"></script>
            <script type="text/javascript" src="__path_to_siesta__/siesta-all.js"></script>
            
            <script type="text/javascript" src="index.js"></script>
        </head>
        
        <body>
        </body>
    </html>

Please note, that the harness page is subject for the same-origin policy as any other web pages. You can include the scripts/css from another domains, but XHR requests on older browsers
are restricted to the same domain. The best approach is to run the test suite on the same domain as your application. You can also configure a proxy. 

Ok, we are ready to write a simple sanity test. It's always a good idea to start your test suite with some sanity checks that ensure the environment is really
in the state that you expect. For example since we are preloading the ExtJS library, let's make sure it is really there. Also, let's check your main class `Your.Project` has been
loaded as well.

Here is how the content of such sanity test will look like (put this into `010_sanity.t.js` file):

    // also supports: startTest(function(t) {
    StartTest(function(t) {
        t.diag("Sanity");
        
        t.ok(Ext, 'ExtJS is here');
        t.ok(Ext.Window, '.. indeed');
        
        
        t.ok(Your.Project, 'My project is here');
        t.ok(Your.Project.Util, '.. indeed');
        
        t.done();	// Optional, marks the correct exit point from the test
    })    

The test code should be wrapped with `StartTest(function (t) { ... })` construct. The function passed to it will receive an instance of the {@link Siesta.Test} as the 1st argument.
Camel cased variant `startTest(function (t) { ... })` is also supported and can be used if you are using JSLint code validation or similar tool. 

The instance of test class has various methods for *assertion checking*. An "assertion" is any statement about your code. It may have arbitrary semantics, 
ranging from very simple, like "this variable is equal to that variable" to complex and domain specific: "this instance of Observable will fire this event exactly N 
times during the following X milliseconds". Siesta has various general-purpose assertions built-in and it also allows you to create your own assertions.
The statement of the assertion can be either truthy (we'll say - assertion pass) or false (assertion fail).

In the example above we use the simplest possible assertion: `t.ok(value, description)`. It passes when the provided `value` is "truthy", like : `true / 1 / "TRUE" / {}` etc
and fails otherwise. Each assertion also has an optional description which should contain an explanation of what's being asserted.

At the end of each test, one can optionally call `t.done()` method. It will tell to Siesta that the test has reached the correct exit point and no other assertions should be added.
To make this call required, use the {@link Siesta.Harness#needDone needDone} configuration option. See also "Testing asynchronous code" section below.
 
Ok, we have a harness and test, lets open the `index.html` file in a browser and click the "Run all" button in the toolbar. You should see something like this:

{@img images/synopsys.png}

The "020_basic.t.js" has a red cross indicating the file is missing - why not create it after reading a couple of the following sections? ;)


Writing tests in BDD style
------------

Siesta supports BDD syntax for writing your tests. Please refer to this guide for more information: <a href="#!/guide/bdd_conventions">Writing tests in BDD style.</a>


Configuring the harness
---------

A harness can be configured with the {@link Siesta.Harness.Browser.ExtJS#configure configure} method. See the {@link Siesta.Harness.Browser.ExtJS} for a detailed description of all available options.
The most important option is {@link Siesta.Harness.Browser.ExtJS#preload preload}, which defines the files that should be pre-loaded for each test. 
All urls in {@link Siesta.Harness.Browser.ExtJS#preload preload} are relative to the harness file `index.html`. 

Once the harness is configured, you can launch your suite with the {@link Siesta.Harness.Browser.ExtJS#start start} method.

Note that the harness file contains regular javascript code, so you can for example configure it differently depending on some condition:

    var isDev   = window.location.href.match(/localhost/);
    var Harness = Siesta.Harness.Browser.ExtJS;
    
    Harness.configure({
        title       : 'Awesome Test Suite',
        
        preload     : [
            isDev ? '../ext-4.0.6/ext-all-debug.js' : '../ext-4.0.6/ext-all.js',
            isDev ? '../yourproject-all-debug.js' : '../yourproject-all.js'
        ]
    });
    
    Harness.start(
        ...
    );
    
Harness page vs Test page
----------------------

As it was mentioned above, Siesta runs each test isolated - on its *own* "test" page. In the same time, there's a page with Harness
UI page, showing all the tests, results from them etc. Don't confuse these two pages - they are not related.

Typical mistake is to include siesta files in the "preload" option:

    Harness.configure({
        title       : 'Awesome Test Suite',
        
        preload     : [
            '../../siesta-all.js', // WRONG, no need to include siesta files on the test page
            '../my-app-all.js'
        ]
    });
    
In the same manner don't include the files from your application to the harness page (index.html we've created above)



Assertions
---------

Some assertions are generic and cross platform - they belong to the {@link Siesta.Test} class. Others are browser/ExtJS specific - and those are 
listed in the {@link Siesta.Test.Browser} / {@link Siesta.Test.ExtJS} classes.

When an assertion passes - it shows a green checkmark with the assertion description (if description is not provided, Siesta will try to generate 
a sensible default text). When it fails, it also tries to provide you with as much information about the failure as possible, including the 
arguments passed to the assertion method. This is why you are encouraged to use various special assertions for each specific case. For example,
lets say we would like to check if one value is greater than other. We could do that with a simple:

    t.ok(value1 > value2, 'Value1 is greater than value2')
    
But in case of a failure, the only additional information you will see will be something like:

    Failed assertion [ok] at line xxx, 
    Got  : false, 
    Need : "truthy" value"
    
Compare with the output from the more specific "isGreater" assertion: 

    t.isGreater(value1, value2, 'Value1 is greater than value2')

It will output the message along with the provided arguments, instantly making it clear what happened:
    
    Failed assertion [isGreater] at line xxx, 
    Got                : value1, 
    Need, greater than : value2
    
So make sure you've scanned the documentation {@link Siesta.Test} or {@link Siesta.Test.ExtJS} - doing so will save you a lot of time.

At this point you should have enough information to start - feel free to leave this document and start hacking your test suite together :)


User interface
---------

The harness UI is stateful - it keeps the selected row, checked rows and options in cookies. You can refresh the harness page anytime and your settings will remain.

The rows in the test files grid has a context menu:
{@img images/ui-context-menu.png}

The "Options" button in toolbar, contains several checkboxes corresponding to harness {@link Siesta.Harness.Browser.ExtJS configuration options}:
{@img images/ui-configure-buttons.png}  


##Testing asynchronous code

When testing asynchronous code, the test function (passed to `StartTest`) may complete its execution, but the test itself
will still be running and incoming assertions will be valid. So, you need to explain to the test, that it needs to wait some time before finalizing.

For that, before some asynchronous part of the code is started, indicate its beginning with {@link Siesta.Test#beginAsync} or {@link Siesta.Test#wait} methods. 
Then, once the async code complete, use {@link Siesta.Test#endAsync} or {@link Siesta.Test#endWait} accordingly.

Both beginAsync and wait methods will start an "asynchronous code frame", the only difference is that `beginAsync` will return you an auto-generated id for it
(which you need to save to some variable), and `wait` need to receive an unique id as parameter.

For example:

    var async = t.beginAsync();
    
    Ext.Ajax.request({
        url     : 'ajax_demo/sample.json',
        
        success : function (response, opts) {
            t.is(response, 'foobar', 'Response is correct');
            
            t.endAsync(async);
        },
        
        failure : function (response, opts) {
            t.fail("request failed");
            
            t.endAsync(async);
        }
    });
    
Or the same with `wait`:

    t.wait('xhrSample');
    
    Ext.Ajax.request({
        url     : 'ajax_demo/sample.json',
        
        success : function (response, opts) {
            t.is(response, 'foobar', 'Response is correct');
            
            t.endWait('xhrSample');
        },
        
        failure : function (response, opts) {
            t.fail("request failed");
            
            t.endWait('xhrSample');
        }
    });

You can start as many asynchronous code "frames" as you need. By default, all frames will be forced to finalize after 15 seconds, so the whole test
will not get stuck in case of unexpected failures. You can configure this interval in the {@link Siesta.Test#beginAsync beginAsync} and {@link Siesta.Test#wait wait} calls.

Note, that you don't need to use these methods for built-in Siesta methods that accepts callbacks - Siesta already does that for you:

    // the "click" method is asynchronous and accepts a callback
    // there's no need for `beginAsync` though, since its a built-in method
    t.click('.some-button', function () {
    }) 


### Chaining

Many methods of the test class are asynchronous and accept a callback. When you need to execute one such method after another, 
the nesting level can grow quite quickly and affect the readability of the test code:

    t.type(userNameField, 'username', function () {
        t.type(passwordField, 'secret', function () {
            t.click(loginButton, function () {
                // done
            })
        })
    })
    
If you see such code in your tests, make sure you've checked the {@link Siesta.Test#chain chain} method. It allows you keep the nesting to a minimum:

    t.chain(
        function (next) {
            t.type(userNameField, 'username', next)
        },
        function (next) {
            t.type(passwordField, 'secret', next)
        },
        function (next) {
            t.click(loginButton, next)
        },
        function () {
            // done
        }
    })
    
Or even more compact notation, providing action configuration objects instead of functions:

    t.chain({
        action  : 'type',
        target  : userNameField, 
        text    : 'username'
    },{
        action  : 'type',
        target  : passwordField, 
        text    : 'secret'
    },{
        action  : 'click',
        target  : loginButton 
    })

 
### Waiting

Since the nature of web applications is very asynchronous (Ajax calls, animations, etc.), be prepared to wait a lot in your tests. 
To wait for a condition, do:

    this.waitFor(
        // The condition to check for, this line will mean waiting until the presence of #foo element
        function() { return document.getElementById('foo'); },  

        // The callback, after the condition has been fulfilled
        function(el) { /* DO COOL STUFF */ }	      
    );
    
You will find lots and lots of waitForXXX methods in the API to assist you in various situations, example:

	t.waitForSelector('.some_class', function() {
        // Found it
	});

    document.body.className = 'some_class';	// this fulfills the condition, 
                                            // and the callback function is called

You can also wait easily in a chain, by adding a "waitFor" step with a value equal to XXX of any waitForXXX command as the value:

	t.chain({
		{ waitFor : 'selector', args : ['.some_class'] },	// calls waitForSelector which waits until 
		                                                    // the some_class CSS class exists in the DOM
		
		{ waitFor : 500 },	                                // waits for 500 ms

		{ waitFor : 'elementVisible', args : [someEl] },	// calls waitForElementVisible and waits 
		                                                    // for an element to become visible
	 });

Simulating user interaction
---------

Siesta can simulate user interactions such as click, double click, type, drag-drop etc. You can find these various methods documented in the API under Test/Simulate. Keep
in mind, for test involving mouse interaction - you should not move your mouse during the execution of such test, when it runs visibly.


Detecting global variable leaks
---------

Siesta has a special built-in assertion, called {@link Siesta.Test#verifyGlobals t.verifyGlobals()}. It will scan the global properties of the test 'window' object,
and compare them with the properties of a clean and fresh scope (properties from an empty `<iframe>`). In case it finds any "unexpected" globals
it will report them as a test failure. You can specify your list of additional "expected" globals, using the {@link Siesta.Harness#expectedGlobals expectedGlobals} configuration
option of the harness, or by using the {@link Siesta.Test#expectGlobals t.expectGlobals} method of your test.

You can enable this assertion to be executed automatically at the end of each test, by setting {@link Siesta.Harness#autoCheckGlobals autoCheckGlobals} to true on the harness configuration.

For example, in harness:

    Harness.configure({
        autoCheckGlobals    : true,
        expectedGlobals     : [ 'Ext', 'MyProject' ],
        ...
    });

And then in tests:

    // will suppress the complaints about these globals
    t.expectGlobals('Additional', 'Globals');

Please note however, that this feature is not supported in IE <= 8, due to a bug in its JavaScript implementation: <http://social.msdn.microsoft.com/Forums/en/iewebdevelopment/thread/065a5b93-6474-4756-aaea-1fd55d4a013a>
Also see: <http://blogs.msdn.com/b/ericlippert/archive/2005/05/04/414684.aspx>


Organizing tests in folders
---------

As your test suite grows, you may need to start grouping your tests in a logical hierarchy. You can do this easily by passing special "test file descriptors" instead of strings to the {@link Siesta.Harness#start} method.
The descriptor should contain a group name and an array of child descriptors: 

    Harness.configure({
        ...
    });

    Harness.start(
        '011_simple.t.js',
        '012_complex.t.js',
        {
            group       : 'Rendering tests',
            
            items       : [
                'rendering/grid.t.js',
                'rendering/tree.t.js'
            ]
        }
    );
    
In turn, child descriptors can be groups as well. This feature is especially useful, when you need to override the {@link Siesta.Harness.Browser.ExtJS harness}
options for some group of tests (see the following section).

See also {@link Siesta.Harness#start} method for additional information.


Configuring individual tests
---------

When configuring a "test file descriptor", one can also provide some of the harness configuration options and they will override the corresponding options that were provided to the harness.
These options are explicitly marked in the {@link Siesta.Harness.Browser.ExtJS harness} documentation. 
For example, one can have a test with its own `preload` and `autoCheckGlobals` configs: 

    Harness.configure({
        autoCheckGlobals    : false
        ...
    })
    
    Harness.start(
        {
            url     : '011_simple.t.js',
            
            autoCheckGlobals : true,
            preload : [
                ...
            ]
        },
        '012_complex.t.js'
    )

When specifying config options for a group descriptor, these options will override the configuration for all child descriptors of that group:

    Harness.start(
        {
            group       : 'On demand loading',
            
            // will override the `preload` option for all tests in this group
            preload     : [
                ...
            ],
            
            items       : [
                ...
            ]
        }
    )
    
You can also provide test file descriptor in the test file itself, by addding it to the StartTest call:

    StartTest({
        autoCheckGlobals : false
    }, function (t) {
        ...
    }) 
    
Values from this object takes the highest priority and will override any other configuration.  

See also {@link Siesta.Harness#start} method for additional information.


"TODO" assertions
---------

Sometimes you might want to mark some assertions in a test as "TODO". For example, you might start to write a test covering an edge case,
but only fully implement it later. It's still desirable to run such assertions (sometimes they can accidentally start passing actually), 
but if they fail - that doesn't mean a failure of the whole test.

In such cases you can wrap your assertions using the {@link Siesta.Test#todo t.todo()} method:

    t.todo('Scheduled for 4.1.x release', function (todo) {
    
        var treePanel    = new Ext.tree.Panel()
    
        todo.is(treePanel.getView().store, treePanel.store, "NodeStore and TreeStore have been merged and there's only 1 store now");
    })
    
As you can see, the `todo` method accepts a description and a new test function. That function will receive a new "TODO" test instance, as the 1st argument
(you can name it arbitrarily). Any failures coming from the methods of this new test instance will be reported as "green", as they are expected.
 

Extending the test class
---------

Quite often you may find yourself repeating various initialization code in your tests. Or you may have your own assertions, specific to your data.
To avoid repeation, you can extend the default Siesta test class by adding own methods to it. Please refer to <a href="#!/guide/extending_test_class">this guide</a> to know more.

Automation
---------

You can run your tests from the command line using a headless Webkit (provided by PhantomJS). This option is suitable for Linux servers w/o graphic cards.
Or, you can launch your tests in several browsers simultaneously, using Selenium. Please refer to <a href="#!/guide/siesta_automation">Automation Guide.</a> for more information.  


Best practices
---------

In general, you can organize your tests suite as you prefer - there are no strict rules where to place the files, how to name them, etc. Choose the way
that is more appropriate and efficient in your case. 

There are, however, some simple guidelines. First of all, treat your test suite as you treat your main codebase. After all *it is* a part of your codebase, just not visible to the end user.
You will need to maintain it, update tests after refactoring (refactoring having a test suite is very pleasant experience btw) and so on.

So, use the same coding style and practices as in your main codebase, provide meaningful assertion descriptions, write comments in non-trivial places, avoid repeating code
and keep your test suite up-to-date.


Running tests in NodeJS
---------

If your code is written in a cross-platform manner, you can also run your tests in NodeJS. For that, first of all, install Siesta in the "node_modules"
folder of your project. Then, in the harness, detect the platform and choose a correct harness class, like this: 

    var Harness
    
    if (typeof process != 'undefined' && process.pid) {
        Harness = require('siesta');
    } else {
        Harness = Siesta.Harness.Browser.ExtJS
    }

And finally, launch the harness file in NodeJS:

    > node tests/index.js
    
You will see the same output as when running the test suite in PhantomJS. See also the "nodejs-browsers" example in the "/examples" folder.

In case of any failures in the test suite, the command will exit with non-zero exit code.


Buy this product
---------

Visit our store: <http://bryntum.com/store/siesta>


Support
---------

Ask question in our community forum: <http://www.bryntum.com/forum/viewforum.php?f=20>

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