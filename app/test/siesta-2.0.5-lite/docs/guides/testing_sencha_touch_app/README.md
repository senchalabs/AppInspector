Intro
---------

In this guide, we show you how to write application level tests with Siesta. Note, that application 
tests are very different from unit tests, where you typically take one class and focus on testing its API. 
For an application test, we typically just point Siesta to a {@link Siesta.Harness.Browser#hostPageUrl} and perform actions
on the page.

A sample application
---------

The sample used in this guide can also be found in the Siesta examples folder: `/examples-touch/DemoApp`. 
The harness html file is called `tests.html` and javascript part of harness is called `tests.js`. 
Note, that `tests.html` is purposefully placed near the `index.html` file which is an entry point to the application.
In this way, the relative paths to externals files in the tests will be the same as in application. 

The sample is based on one of the samples in the Sencha Touch SDK examples folder. To make it more application like, 
we added a login screen since this is a very common use case in apps built with Sencha Touch. 
Overall, the demo application is very simple and features these screens:

<img style="float:left;width:20%;margin-right:1%" src="http://www.bryntum.com/wp-content/uploads/2013/02/Screen-Shot-2013-02-13-at-5.46.03-PM.png" alt="Screen Shot 2013-02-13 at 5.46.03 PM" width="200" class="alignnone size-thumbnail wp-image-2595" />
<img style="float:left;width:20%;margin-right:1%" src="http://www.bryntum.com/wp-content/uploads/2013/02/Screen-Shot-2013-02-13-at-5.47.15-PM.png" alt="Screen Shot 2013-02-13 at 5.47.15 PM" width="200" class="alignnone size-thumbnail wp-image-2596" />
<img style="float:left;width:20%;" src="http://www.bryntum.com/wp-content/uploads/2013/02/Screen-Shot-2013-02-13-at-5.47.25-PM.png" alt="Screen Shot 2013-02-13 at 5.47.25 PM" width="200" class="alignnone size-thumbnail wp-image-2597" />
<div style="clear:both"></div>
<br>

First, a user should login and after logging in, an address list is shown. You can then click a contact in the list
and see his or her details.

Testing objectives
---------

To perform a basic smoke test of this application, let's write three basic application tests.

1. A sanity test to assert that upon visiting the app page, the login screen is shown
2. A basic login test, which navigates to one of the contacts in the list.
3. A basic logout test which makes sure we can log out ok.

The Harness code can be seen below:

    var Harness = Siesta.Harness.Browser.SenchaTouch;

    Harness.configure({
        title       : 'Sencha Touch 2 samples',
        testClass   : Your.Test.Class
    });

    Harness.start(
        {
            group         : 'Application tests',
            hostPageUrl   : 'DemoApp/',
            performSetup  : false,       // This is done by the app itself
            items         : [
                 'tests/100_sanity.t.js',
                 'tests/101_login.t.js',
                 'tests/102_logout.t.js'
            ]
        }
    );
    // eof Harness.start

1. The "sanity" test
---------

A sanity test is a simple way of knowing the health of the test subject. For a typical application, 
that might mean to load up the start page and assure that the login window appears. No exceptions 
should be thrown, no errors should be found and no global variables leaked etc.
Here's the Siesta test code for the 'sanity' test.

    StartTest(function(t) {

        t.chain(
            { 
                waitFor : 'CQ', 
                args    : 'loginview',
                desc    : 'Should find login view on app start'
            },

            function(next) {
                t.ok(t.cq1('#logInButton'), 'Should find a login button');
            }
        );
    });

The test waits for a known [Ext.ComponentQuery](http://docs.sencha.com/extjs/#!/api/Ext.ComponentQuery), the 'loginview' xtype.
Once it's detected, we consider it a green light and just check that the login button is also created. 
This is very simplistic, but still tells us that the landing page is healthy and no silly errors has leaked on it.

2. The "login" test
---------

This test starts by waiting for the login button to be visible. Since we want to tap
the button, it's not enough just to wait for it to exist - it also has to be visible so we can 'reach' it 
(during rendering, components are often rendered off-screen). 
After this step, we simply set some values in the login fields. We're not simulating typing, 
since there is no reason to test this - it's a lot faster and more robust to just use the public Field API. 
After logging in, we wait for a {@link Siesta.Test.ExtJSCore#compositeQuery compositeQuery} - a component query combined with a CSS query. 
Once we find a contact item in the DOM, we tap it to show the contact details.

    StartTest(function(t) {
    
        t.chain(
            { waitFor : 'componentVisible', args : '#logInButton' },
    
            function(next) {
                t.cq1('#userNameField').setValue('John Doe');
                t.cq1('#passwordField').setValue('SecretUnhackablePW');
                next();
            },
    
            { tap : '>> #logInButton' },
    
            // We'd like to find a headshot icon the DOM, that's proof the main app has been launched ok
            { 
                waitFor : 'compositeQuery', 
                args    : 'contacts => .headshot',
                desc    : 'Should be able login and see contact list'
            },
    
            { tap : 'contacts => .headshot' },
    
            { waitFor : 'componentVisible', args : 'map' },
    
            function(next) {
                t.pass('Should see a detail view with map after tapping a contact');
            }
        );
    });

3. The "logout" test
---------

This logout test just logs in, and immediately logs out again. This should take the user back to the login dialog, and this is exactly what's being assured in the test code below.

    StartTest(function(t) {

         t.chain(
             { waitFor : 'componentVisible', args : '#logInButton' },

             function(next) {
                 t.cq1('#userNameField').setValue('John Doe');
                 t.cq1('#passwordField').setValue('SecretUnhackablePW');
                 next();
             },

             { tap : '>> #logInButton' },

             // We'd like to find a headshot icon the DOM, that's proof the main app has been launched ok
             { waitFor : 'compositeQuery', args : 'contacts => .headshot' },

             function(next) {
                 t.willFireNTimes(App, 'logout', 1);
                 next();
             },

             { tap : '>>#logoutButton' },

             { waitFor : 'componentVisible', args : 'loginview' },

             function(next) {
                 t.pass('Should be able to log out and see login view');
             }
         );
    });

Final Refactoring
---------

As you can see in the logout test, we're duplicating the login process code. If we want to perform the login operation in many tests,
it makes sense to break this behavior out and put it into a custom test class. See the ["Extending test class"](#!/guide/extending_test_class) 
guide for more details, here we'll just present the result:

    Class('Your.Test.Class', {

        isa     : Siesta.Test.SenchaTouch,

        methods: {
            login : function (user, pw, next) {
                var me = this;

                this.chain(
                    { waitFor : 'componentVisible', args : '#logInButton' },

                    function(next) {
                        me.cq1('#userNameField').setValue(user);
                        me.cq1('#passwordField').setValue(pw);
                        next();
                    },

                    { action : 'tap', target : '>> #logInButton' },
                    { waitFor : 'compositeQuery', args : 'contacts => .headshot' },

                    next
                );
            }
        }
    });

Note, that new `login` method is asynchronous - it accepts a callback, called `next`, which will be executed *after* login has completed.
Sample usage for the new method:

    t.login('User', 'SecretPassword', function () {
        // do something after login
    })
    
    // or, using "chain" method:

    t.chain(
        ...
        function (next) {
            t.login('User', 'SecretPassword', next)
        },
        ...
    ) 

To plug this test class into your Siesta test suite, you need to simply load it on the harness page, right after "siesta-all.js" file:

        <!-- Siesta application -->
        <script type="text/javascript" src="../../siesta-all.js"></script>
        
        <!-- Custom test class -->
        <script type="text/javascript" src="tests/lib/TestClass.js"></script>
 
Then, you configure the {@link Siesta.Harness#testClass testClass} property of the harness:

    Harness.configure({
        ...
        testClass   : Your.Test.Class,
        ...
    })


Automatic login
---------------

Sometimes its needed to perform an automatic login before every test, or before some group of tests. For that, you can use the {@link Siesta.Test#setup} method.
For example, if we should use the `login` method, created above, before every test with "auto_login" string in url, it may look as following:

    Class('Your.Test.Class', {

        isa     : Siesta.Test.SenchaTouch,

        methods: {
            login : function (user, pw, next) {
                ...
            },
            
            setup : function (callback, errback) {
                if (this.url.match(/auto_login/)) {
                    // call the `login` method for tests with "auto_login" string in url
                    // setup will wait until the login completes
                    this.login('TestUser', '12345', callback)
                } else {
                    // call the `callback` immediately - setup will proceed to the test start
                    // right away
                    callback()
                }
            }
        }
    });
    

Testing ExtJS application
----------------------

When testing ExtJS application, exactly the same principles applies. The only difference is that you need to use {@link Siesta.Harness.Browser.ExtJS} class for harness,
and {@link Siesta.Test.ExtJS} as a base test class, when extending it.


Conclusion
----------

We hope this gives you some inspiration on how to write application level tests for your Sencha Touch applications. Don't forget to write unit tests too :)


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


COPYRIGHT AND LICENSE
---------

Copyright (c) 2009-2013, Bryntum & Nickolay Platonov

All rights reserved.