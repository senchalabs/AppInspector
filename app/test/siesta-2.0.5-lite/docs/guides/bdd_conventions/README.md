Intro
-----

BDD style testing focuses on readable tests, with the goal that the test suite should form a readable documentation.

Siesta allows you to write tests in the BDD style. Keep in mind though, 
that not every test, especially the ones involving
user interactions, can be cleanly expressed in BDD statements. 
If you find yourself confused what BDD construct to use - just fallback to 
"normal" free-form testing.

## Test suites and specs

In BDD terms, a *test suite* is a function containing test *specs* or other suites.
A test suite can be started with {@link Siesta.Test#describe describe} method:

    StartTest(function (t) {
        t.describe("My system", function (t) {
            ...
        })
    })

In turn, test *spec* is also a function, containing test *specs* or other suites.
It can be started with the {@link Siesta.Test#it it} function.

    StartTest(function (t) {
        t.describe("My system", function (t) {
            t.it("Should allow user to log in", function (t) {
                ...
            })
        
            t.describe("Report engine of my system", function (t) {
                t.it("Should allow generate reports in PDF", function (t) {
                    ...
                })
            })
        })
    })

** Every test suite or test spec function receives a new test instance as the 1st argument.
All further method calls should use this newly provided instance.**

Test suites and test specs can be nested arbitrarily.

Please do not confuse the BDD term "test suite" with the "test suite" term used in
other places of this documentation. The latter means "all tests in all files, that 
you have for your system".

## Expectations

Assertions in BDD testing are called *expectations* or, sometimes, "matchers". They should
reside inside the test specs and can be created with the {@link Siesta.Test#expect expect} method.

    StartTest(function (t) {
        t.describe("My system", function (t) {
            t.it("Should allow user to log in", function (t) {
                t.expect(MyApp.LoginManager.isLoggedIn()).toBe(false)
                
                MyApp.LoginManager.login()
                
                t.expect(MyApp.LoginManager.isLoggedIn()).toBe(true)
            })
        
            t.describe("Report engine of my system", function (t) {
                t.it("Should allow generate reports in PDF", function (t) {
                    ...
                })
            })
        })
    })
   
Please refer to the {@link Siesta.Test.BDD.Expectation} for the list of supported expectations.

## Under the hood

Internally, test specs and test suites are regular Siesta sub-tests, created with the {@link Siesta.Test#getSubTest} method.
Any regular Siesta assertion or method of the test class can be used inside of a test or spec, including asynchronous methods like {@link Siesta.Test#chain} or {@link Siesta.Test#beginAsync}.


## Execution order

Test suites and specs are executed in the order they are declared. Note, that they are not started right away - first, the whole containing
block is executed:  

    StartTest(function (t) {
        var a = 1;

        t.describe("Something", function (t) {
            // "a" is "3" here
            var b = 1;

            t.it("Should do this", function (t) {
                // "b" is "3" here
            });
        
            b = 2;

            t.it("Should do this", function (t) {
            });

            b = 3;
        })
        
        a = 2;
        
        t.describe("Something", function (t) {
            t.it("Should do this", function (t) {
            });
        
            t.it("Should do this", function (t) {
            });
        })
        a = 3;
    });

The following suite/spec starts its execution only **after the previous one completes**. This includes any delays caused by
testing asynchronous code. For example:

    StartTest(function (t) {
        t.describe("Something", function (t) {
            // this spec will be considered completed only after the inner `waitFor` method
            // will complete it waiting
            t.it("Should do this", function (t) {
                t.waitFor(300, function () {
                    ...
                });
            });
        
            // this spec will start only after previous - including waiting from `waitFor` method
            // in turn, this spec will be considered completed only after matching `endAsync` call
            t.it("Should do this", function (t) {
                var async = t.beginAsync();
                ...
            });
        });
    });

Also, a test suite or spec will wait for of all its child suite/specs to complete before its considered complete as a whole.
 

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