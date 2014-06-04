Intro
---------

This guide describes how you can test an Ext JS MVC application with Siesta.

Setting up the test suite
---------

When setting up the test suite for an MVC application, put the test harness file (called index.html in the 
<a href="#!/guide/siesta_getting_started">Getting Started Guide</a>) in the same folder as your "app.html" file.
This way you won't have to change any URLs for your proxies (which are probably configured relative to "app.html").

Make use of {@link Siesta.Harness.Browser.ExtJS#loaderPath loaderPath} option which will set up the Ext.Loader for all of your tests. 

Also check the {@link Siesta.Harness.Browser.ExtJS#waitForAppReady waitForAppReady} option - it will be useful if you have a group of tests which should start
after the launch of application.

See the `/examples/025-extjs-mvc` in the Siesta package for a sample setup.

Testing strategies
---------

Here we'll describe various testing strategies for your application.


Test the model first.
---------

You may already have heard the "fat model, skinny view" idiom. It means - put as much of business logic in the Model, don't pollute the View with it.
The Model should be completely unaware about the UI and be self-contained. It's not only a clean separation of your code, but you also ensure that you can safely
refactor the UI whilst keeping the business requirements intact. This way the model can also be easily tested, w/o involving any the interaction with the UI.

By starting your test suite with Model you also limit the scope of uncertainty during debugging. Having the Model well test-covered, you can always say 
"this bug must be somewhere in the View or Controller". 

For example. If you have a login form, don't put the authentication logic to the "click" handler of the "Login" button.
Instead, you can have an "App.AuthManager" class in your application, which can have a "login" method.
Then, in the "click" handler, you will just call "App.AuthManager.login()".  


Test views (individual components) after Model.
---------

Second step in testing your application will be to test your views (individual components such as grids and trees). This does not mean you need to use exactly one component class in your test - 
but use as few classes as required to instantiate and operate on the component being tested. 

Again, testing the individual parts of your application limits the scope of uncertainty and side-effects.


Test the application as a whole.
---------

Finally, test your application "in the wild" facing all possible side effects. When finding a bug, first try to move the test for it to on one of described testing strategies.
Only if that is not possible write tests at the whole application level.


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