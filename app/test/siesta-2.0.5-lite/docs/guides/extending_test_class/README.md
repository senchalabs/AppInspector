Intro
---------

As your test suite grows you often notice that you are repeating certain pieces of code in your tests. You should then consider extending the Siesta test class with your own utility and assertion methods.

It can be just a simple helper method returning some pre-populated data store, or a new assertion method which reports results to the harness like any other.

Extending the Siesta test class
---------

All Siesta assertions are methods belonging to the Siesta.Test class. To create a new assertion method you will need to subclass the test class.
When creating assertions purposed for testing JavaScript code built with Ext JS - subclass the {@link Siesta.Test.ExtJS}. For testing NodeJS code - use {@link Siesta.Test} as your base class.

Siesta is written using the [Joose](http://joose.it) class system, the following example will show you how to subclass the test class.

Let's create 2 special assertions, which will be checking the odd parity of a passed number. Usually, an assertion needs to check its statement and report the result 
with either {@link Siesta.Test#pass} or {@link Siesta.Test#fail} methods. 

    Class('MyProject.MyTestClass', {
        isa     : Siesta.Test.ExtJS,
        
        methods : {
            
            isOdd : function (number, description) {
                if (number % 2) {
                    this.pass(description);
                } else {
                    this.fail(description, {
                        assertionName   : 'isOdd',
                        got             : number,
                        annotation      : 'Need odd number'
                    });
                }
            },
             
            isEven : function (number, description) {
                if (!(number % 2)) {
                    this.pass(description);
                } else {
                    this.fail(description, {
                        assertionName   : 'isEven',
                        got             : number,
                        annotation      : 'Need even number'
                    });
                }
            }
        }
    })
    
When failing, try to provide as much information about the failure as possible and format the failure message in a readable form. Please refer to {@link Siesta.Test#fail}
method documentation for additional options.

To make the Harness use your new test class you have to specify the test class to use by setting the {@link Siesta.Harness#testClass} configuration option:

    Harness.configure({
        title       : 'Awesome Test Suite',
        
        testClass   : MyProject.MyTestClass,
        
        preload     : [
            ...
        ]
    })

The test class should be loaded right after the siesta-all.js file:

    <!DOCTYPE html>
    <html>
        <head>
            <link rel="stylesheet" type="text/css" href="http://cdn.sencha.io/ext-4.1.0-gpl/resources/css/ext-all.css">
            <link rel="stylesheet" type="text/css" href="__path_to_siesta__/resources/css/siesta-all.css">
            
            <script type="text/javascript" src="http://cdn.sencha.io/ext-4.1.0-gpl/bootstrap.js"></script>
            <script type="text/javascript" src="__path_to_siesta__/siesta-all.js"></script>
            
            <!-- The file with new test class -->
            <script type="text/javascript" src="lib/MyTestClass.js"></script>
            
            <script type="text/javascript" src="index.js"></script>
        </head>
        
        <body>
        </body>
    </html>


Things to note
---------

- `this` inside of assertion methods corresponds to the test instance (often seen as `t` in the examples)

- The Test class "belongs" to the context of the harness. Each test will have its own global context. So, `window` inside of an assertion method is different from the `window` inside of `StartTest`.

- To get the "window" of the test page, use "this.global"

- For Ext JS tests: To get the Ext object from the scope of the test page use {@link Siesta.Test.ExtJS#getExt this.getExt()}, which is a shortcut for `this.global.Ext`

- A new test class should be included in the harness file - index.html

- When performing asynchronous operations inside of a helper method - always wrap them with `this.beginAsync/this.endAsync` calls


Custom setup
------------

Sometimes, you need to execute some code before every test start. For this purpose you can use {@link Siesta.Test#setup} method, please refer to its documentation 
for details. There's also {@link Siesta.Test#isReady} method, which is  slightly harder to implement.

More examples
--------- 

See also the `/examples/023-extjs-grid` example.

    Class('MyProject.MyTestClass', {
        isa     : Siesta.Test.ExtJS,
        
        methods : {
            
            // create a grid with some pre-defined configuration
            getGrid : function (config) {
                // Get the `Ext` object from the context of test page
                var Ext     = this.getExt();
                
                return Ext.create('Ext.grid.Panel', Ext.apply({
                    ...
                }, config));
            },
            
            // a custom wrapper around the `this.waitFor`
            waitForAppLogin : function (callback, scope, timeout) {
                // Get the `MyApp` reference from the context of test page
                // this.global is a "window" object of the test page
                var MyApp       = this.global.MyApp
            
                this.waitFor(function () {
                    return MyApp.AuthManager.isAuthenticated();
                }, callback, scope, timeout);
            } 
        }
    });



Buy this product
---------

Visit our store: <http://bryntum.com/store/siesta>


Support
---------

Ask questions in our community forum: <http://www.bryntum.com/forum/viewforum.php?f=20>

Share your experience in our IRC channel: [#bryntum](http://webchat.freenode.net/?randomnick=1&channels=bryntum&prompt=1)

Please report any bugs through the web interface at <https://www.assembla.com/spaces/bryntum/support/tickets>


See also
---------

Web page of this product: <http://bryntum.com/products/siesta>

Other Bryntum products: <http://bryntum.com/products>


COPYRIGHT AND LICENSE
---------

Copyright (c) 2009-2013, Bryntum AB & Nickolay Platonov

All rights reserved.