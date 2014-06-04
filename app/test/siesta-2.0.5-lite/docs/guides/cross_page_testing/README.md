Description
---------

**This feature is experimental and any related functionality is subject to change.**

Modern RIA applications rarely require a full page refresh, but sometimes you may still need to write such test,
for example when testing a login form submit. This guide describes the specifics of writing such a test.

Please note, that this functionality is available only in the <a href="http://bryntum.com/store/siesta">Standard Package</a>.


Cross page testing
---------

To be able to test the page refresh/redirect, the *test script* (\*.t.js file) should reside in a different context from the *test page*.
This can be achieved with the {@link Siesta.Harness.Browser#separateContext separateContext} option of the harness.
Despite being a harness option, it should normally only be used in individual test descriptors:

    Harness.start(
        '010_normal_test.t.js',
        {
            separateContext     : true,
            url                 : '020_page_redirect.t.js'
        }
    )
    
Please note, that any preload files you have will still be loaded in the context of the *test page* and **not** the context of the script.

Since contexts are separated, you will need to use `t.global` to reach any global objects of the test page. 

    StartTest(function (t) {
    
        // BAD - the "MyApp" global is loaded into different page
        var store = new MyApp.MyStoreClass();
        
        
        // GOOD - pick the "MyApp" global from the test page
        var store = new t.global.MyApp.MyStoreClass();
        
        // BEST - save all required globals upfront, in variables
        var MyApp   = t.global.MyApp;
        var Ext     = t.Ext();
    }) 

There a special shortcut `t.getExt() / t.Ext()` for `t.global.Ext` if you are testing an Ext JS application.

When you need to perform a page redirect or refresh use `t.waitForPageLoad()` method. It accepts a callback which will receive the `window` object of the new page (same as `t.global`).
In case of using the Ext JS testing layer, it will also receive the new `Ext` object as the 2nd argument. **Don't forget to update your references to the global objects - they are now different!**  

        t.waitForPageLoad(function (window, Ext) {
            //                               | 
            // new reference to `MyApp` and Ext
            //                     |
            var MyApp   = window.MyApp;
        
            var panel   = Ext.getCmp('authResult')
            
            t.is(panel.authResult, 'success', 'Correct authentication result')
        })


Note about `setTimeout`
---------

The `setTimeout` function in browsers is not synchronized across different contexts. Thus if you will call `setTimeout` inside of the *test page* with lets say 100ms delay,
and then you call `setTimeout` from the *test script* with 150ms delay, there's no guarantee that the 1st function will actually be called first. 

Because of that, it's recommended to always use the `setTimeout` from the scope of the *test page*: `t.global.setTimeout`. 
Siesta provides a simple shortcut for that: {@link Siesta.Test.Browser#setTimeout t.setTimeout()} / {@link Siesta.Test.Browser#clearTimeout t.clearTimeout()}

        // pick the `MyApp` from the scope of test page
        var MyApp       = t.global.MyApp
        
        // call the method, involving the deferred calls
        MyApp.defer(function () {}, 100ms)

        // BAD: this `setTimeout` is not synchronized with the `setTimeout` of the application
        var timeoutId = setTimeout(function () {}, 150)
        
        clearTimeout(timeoutId)


        // GOOD: using `setTimeout` from the scope of test page
        var timeoutId = t.setTimeout(function () {}, 150)
        
        t.clearTimeout(timeoutId)
  

Limitations
---------

- Enabling the {@link Siesta.Harness.Browser#separateContext separateContext} option will disable the {@link Siesta.Harness.Browser#overrideSetTimeout overrideSetTimeout}.
When doing **any** asynchronous operation, use {@link Siesta.Test#beginAsync t.beginAsync()}/{@link Siesta.Test#endAsync t.endAsync()} calls.

- Debugging is only possible in WebkitInspector and IE, Firebug can't see the test scripts for some reason. 


Example
---------

See the "/examples/100-standardpkg-page-redirect"


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