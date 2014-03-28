/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.More

A mixin with additional generic assertion methods, which can work cross-platform between browsers and NodeJS. 
Is being consumed by {@link Siesta.Test}, so all of them are available in all tests. 

*/
Role('Siesta.Test.More', {
    
    requires        : [ 'isFailed', 'typeOf', 'on' ],
    
    
    has : {
        autoCheckGlobals        : false,
        expectedGlobals         : Joose.I.Array,

        disableGlobalsCheck     : false,
        
        browserGlobals : { 
            init : [
                'console',
                'getInterface',
                'ExtBox1',
                '__IE_DEVTOOLBAR_CONSOLE_COMMAND_LINE',
                'seleniumAlert',
                'onload',
                'onerror', 
                'StartTest',
                'startTest',
                'describe',
                // will be reported in IE8 after overriding
                'setTimeout',
                'clearTimeout',
                'requestAnimationFrame',
                'cancelAnimationFrame',
                '__coverage__',
                /__cov_\d+/
            ]
        },
        
        /**
         * @cfg {Number} waitForTimeout Default timeout for `waitFor` (in milliseconds). Default value is 10000. 
         */
        waitForTimeout          : 10000,
        
        waitForPollInterval     : 100
    },
    
    
    methods : {
        
        /**
         * This assertion passes, when the comparison of 1st with 2nd, using `>` operator will return `true` and fails otherwise. 
         * 
         * @param {Number/Date} value1 The 1st value to compare
         * @param {Number/Date} value2 The 2nd value to compare
         * @param {String} desc The description of the assertion
         */
        isGreater : function (value1, value2, desc) {
            if (value1 > value2)
                this.pass(desc, {
                    descTpl             : '`{value1}` is greater than `{value2}`',
                    value1              : value1,
                    value2              : value2
                })
            else
                this.fail(desc, {
                    assertionName   : 'isGreater',
                    
                    got         : value1,
                    need        : value2,
                    
                    needDesc    : "Need, greater than"
                })
        },
        
        
        /**
         * This assertion passes, when the comparison of 1st with 2nd, using `<` operator will return `true` and fails otherwise. 
         * 
         * @param {Number/Date} value1 The 1st value to compare
         * @param {Number/Date} value2 The 2nd value to compare
         * @param {String} desc The description of the assertion
         */
        isLess : function (value1, value2, desc) {
            if (value1 < value2)
                this.pass(desc, {
                    descTpl             : '`{value1}` is less than `{value2}`',
                    value1              : value1,
                    value2              : value2
                })
            else
                this.fail(desc, {
                    assertionName   : 'isLess',
                    
                    got         : value1,
                    need        : value2,
                    
                    needDesc    : "Need, less than"
                })
        },
        

        isGE : function () {
            this.isGreaterOrEqual.apply(this, arguments)
        },
        
        /**
         * This assertion passes, when the comparison of 1st with 2nd, using `>=` operator will return `true` and fails otherwise. 
         * 
         * It has a synonym - `isGE`.
         * 
         * @param {Number/Date} value1 The 1st value to compare
         * @param {Number/Date} value2 The 2nd value to compare
         * @param {String} desc The description of the assertion
         */
        isGreaterOrEqual : function (value1, value2, desc) {
            if (value1 >= value2)
                this.pass(desc, {
                    descTpl             : '`{value1}` is greater or equal to `{value2}`',
                    value1              : value1,
                    value2              : value2
                })
            else
                this.fail(desc, {
                    assertionName   : 'isGreaterOrEqual',
                    
                    got         : value1,
                    need        : value2,
                    
                    needDesc    : "Need, greater or equal to"
                })
        },
        

        
        isLE : function () {
            this.isLessOrEqual.apply(this, arguments)
        },
        
        /**
         * This assertion passes, when the comparison of 1st with 2nd, using `<=` operator will return `true` and fails otherwise. 
         * 
         * It has a synonym - `isLE`.
         * 
         * @param {Number/Date} value1 The 1st value to compare
         * @param {Number/Date} value2 The 2nd value to compare
         * @param {String} desc The description of the assertion
         */
        isLessOrEqual : function (value1, value2, desc) {
            if (value1 <= value2)
                this.pass(desc, {
                    descTpl             : '`{value1}` is less or equal to `{value2}`',
                    value1              : value1,
                    value2              : value2
                })
            else
                this.fail(desc, {
                    assertionName   : 'isLessOrEqual',
                    
                    got         : value1,
                    need        : value2,
                    
                    needDesc    : "Need, less or equal to"
                })
        },
        
        
        /**
         * This assertion suppose to compare the numeric values. It passes when the passed values are approximately the same (the difference 
         * is withing a threshold). A threshold can be provided explicitly (when assertion is called with 4 arguments), 
         * or it will be set to 5% from the 1st value (when calling assertion with 3 arguments).
         * 
         * @param {Number} value1 The 1st value to compare
         * @param {Number} value2 The 2nd value to compare
         * @param {Number} threshHold The maximum allowed difference between values. This argument can be omited. 
         * @param {String} desc The description of the assertion
         */
        isApprox : function (value1, value2, threshHold, desc) {
            if (arguments.length == 2) threshHold  = Math.abs(value1 * 0.05)
            
            if (arguments.length == 3) {
                if (this.typeOf(threshHold) == 'String') {
                    desc            = threshHold
                    threshHold      = Math.abs(value1 * 0.05)
                }
            }
            
            // this function normalizes the fractional numbers to fixed point presentation
            // for example in JS: 1.05 - 1 = 0.050000000000000044
            // so what we do is: (1.05 * 10^2 - 1 * 10^2) / 10^2 = (105 - 100) / 100 = 0.05
            var subtract    = function (value1, value2) {
                var fractionalLength    = function (v) {
                    var afterPointPart = (v + '').split('.')[ 1 ]
                    
                    return afterPointPart && afterPointPart.length || 0
                }
                
                var maxLength           = Math.max(fractionalLength(value1), fractionalLength(value2))
                var k                   = Math.pow(10, maxLength);

                return (value1 * k - value2 * k) / k;
            };            
            
            if (Math.abs(subtract(value2, value1)) <= threshHold)
                this.pass(desc, {
                    descTpl             : '`{value1}` is approximately equal to `{value2}`',
                    value1              : value1,
                    value2              : value2,
                    annotation          : value2 == value1 ? 'Exact match' : 'Match within treshhold: ' + threshHold
                })
            else
                this.fail(desc, {
                    assertionName       : 'isApprox', 
                    got                 : value1, 
                    need                : value2, 
                    needDesc            : 'Need approx',
                    annotation          : 'Threshold is: ' + threshHold
                })
        },
        
        
        /**
         * This assertion passes when the passed `string` matches to a regular expression `regex`. When `regex` is a string, 
         * assertion will check that it is a substring of `string`
         * 
         * @param {String} string The string to check for "likeness"
         * @param {String/RegExp} regex The regex against which to test the string, can be also a plain string
         * @param {String} desc The description of the assertion
         */
        like : function (string, regex, desc) {
            if (this.typeOf(regex) == "RegExp")
            
                if (string.match(regex))
                    this.pass(desc, {
                        descTpl             : '`{string}` matches regexp {regex}',
                        string              : string,
                        regex               : regex
                    })
                else
                    this.fail(desc, {
                        assertionName       : 'like', 
                        got                 : string, 
                        need                : regex, 
                        needDesc            : 'Need string matching'
                    })
            else
             
                if (string.indexOf(regex) != -1)
                    this.pass(desc, {
                        descTpl             : '`{string}` has a substring: `{regex}`',
                        string              : string,
                        regex               : regex
                    })
                else
                    this.fail(desc, {
                        assertionName       : 'like', 
                        got                 : string, 
                        need                : regex, 
                        needDesc            : 'Need string containing'
                    })
        },
        
        /**
         * This method is the opposite of 'like', it adds failed assertion, when the string matches the passed regex.
         * 
         * @param {String} string The string to check for "unlikeness"
         * @param {String/RegExp} regex The regex against which to test the string, can be also a plain string
         * @param {String} desc The description of the assertion
         */
        unlike : function(string, regex, desc) {
            if (this.typeOf(regex) == "RegExp")
            
                if (!string.match(regex))
                    this.pass(desc, {
                        descTpl             : '`{string}` does not match regexp {regex}',
                        string              : string,
                        regex               : regex
                    })
                else
                    this.fail(desc, {
                        assertionName       : 'unlike', 
                        got                 : string, 
                        need                : regex, 
                        needDesc            : 'Need string not matching'
                    })
            else
             
                if (string.indexOf(regex) == -1)
                    this.pass(desc, {
                        descTpl             : '`{string}` does not have a substring: `{regex}`',
                        string              : string,
                        regex               : regex
                    })
                else
                    this.fail(desc, {
                        assertionName       : 'unlike', 
                        got                 : string, 
                        need                : regex, 
                        needDesc            : 'Need string not containing'
                    })
        },
        
        
        "throws" : function () {
            this.throwsOk.apply(this, arguments)
        },
        
        throws_ok : function () {
            this.throwsOk.apply(this, arguments)
        },
        
        /**
         * This assertion passes, when the `func` function throws the exception during executing, and the
         * stringified exception passes the 'like' assertion (with 'expected' parameter).
         * 
         * It has synonyms - `throws_ok` and `throws`.
         * 
         * @param {Function} func The function which supposed to throw an exception
         * @param {String/RegExp} expected The regex against which to test the stringified exception, can be also a plain string
         * @param {String} desc The description of the assertion
         */
        throwsOk : function (func, expected, desc) {
            if (this.typeOf(func) != 'Function') throw new Error('throws_ok accepts a function as 1st argument')
            
            var e = this.getExceptionCatcher()(func)
            
            // assuming no one will throw undefined exception..
            if (e === undefined) {
                this.fail(desc, {
                    assertionName       : 'throws_ok', 
                    annotation          : 'Function did not throw an exception'
                })
                
                return
            }
            
            if (e instanceof this.getTestErrorClass())
                //IE uses non-standard 'description' property for error msg
                e = e.message || e.description
                
            e = '' + e
                
            if (this.typeOf(expected) == "RegExp")
            
                if (e.match(expected))
                    this.pass(desc, {
                        descTpl             : 'Function throws exception matching to {expected}',
                        expected            : expected
                    })
                else
                    this.fail(desc, {
                        assertionName       : 'throws_ok', 
                        got                 : e, 
                        gotDesc             : 'Exception stringifies to',
                        need                : expected, 
                        needDesc            : 'Need string matching'
                    })
            else
             
                if (e.indexOf(expected) != -1)
                    this.pass(desc, {
                        descTpl             : 'Function throws exception containing a substring: {expected}',
                        expected            : expected
                    })
                else
                    this.fail(desc, {
                        assertionName       : 'throws_ok', 
                        got                 : e, 
                        gotDesc             : 'Exception stringifies to',
                        need                : expected, 
                        needDesc            : 'Need string containing'
                    })
        },
        
        
        
        lives_ok : function () {
            this.livesOk.apply(this, arguments)
        },
        
        lives : function () {
            this.livesOk.apply(this, arguments)
        },
        
        /**
         * This assertion passes, when the supplied `func` function doesn't throw an exception during execution.
         * 
         * This method has two synonyms: `lives_ok` and `lives`
         * 
         * @param {Function} func The function which is not supposed to throw an exception
         * @param {String} desc The description of the assertion
         */
        livesOk : function (func, desc) {
            if (this.typeOf(func) != 'Function') {
                func = [ desc, desc = func ][ 0 ]
            }
            
            var e = this.getExceptionCatcher()(func)
            
            if (e === undefined) 
                this.pass(desc, {
                    descTpl             : 'Function does not throw any exceptions'
                })
            else
                this.fail(desc, {
                    assertionName       : 'lives_ok', 
                    annotation          : 'Function threw an exception: ' + e
                })
        },
        
        
        isa_ok : function (value, className, desc) {
            this.isInstanceOf(value, className, desc)
        },
        

        isaOk : function (value, className, desc) {
            this.isInstanceOf(value, className, desc)
        },
        
        /**
         * This assertion passes, when the supplied `value` is the instance of the `className`. The check is performed with
         * `instanceof` operator. The `className` parameter can be supplied as class constructor or as string, representing the class
         * name. In the latter case the `class` will eval'ed to receive the class constructor.
         * 
         * This method has synonyms: `isaOk`, `isa_ok`
         * 
         * @param {Mixed} value The value to check for 'isa' relationship
         * @param {Class/String} className The class to check for 'isa' relationship with `value`
         * @param {String} desc The description of the assertion
         */
        isInstanceOf : function (value, className, desc) {
            try {
                if (this.typeOf(className) == 'String') className = this.global.eval(className)
            } catch (e) {
                this.fail(desc, {
                    assertionName       : 'isa_ok', 
                    annotation          : "Exception [" + e + "] caught, while evaluating the class name [" + className + "]"
                })
                
                return
            }
            
            if (value instanceof className) 
                this.pass(desc, {
                    descTpl             : '{value} is an instance of correct class',
                    value               : value
                })
            else
                this.fail(desc, {
                    assertionName       : 'isa_ok', 
                    got                 : value, 
                    need                : String(className), 
                    needDesc            : 'Need, instance of'
                })
        },
        
        
        /**
         * This assertion passes, if supplied value is a String.
         * 
         * @param {Mixed} value The value to check.
         * @param {String} desc The description of the assertion
         */
        isString : function (value, desc) {
            if (this.typeOf(value) == 'String')
                this.pass(desc, {
                    descTpl     : '{value} is a string',
                    value       : value
                })
            else
                this.fail(desc, {
                    got         : value,
                    need        : "A string value"
                })
        },
        
        
        /**
         * This assertion passes, if supplied value is an Object
         * 
         * @param {Mixed} value The value to check.
         * @param {String} desc The description of the assertion
         */
        isObject : function (value, desc) {
            if (this.typeOf(value) == 'Object')
                this.pass(desc, {
                    descTpl     : '{value} is an object',
                    value       : value
                })
            else
                this.fail(desc, {
                    got         : value,
                    need        : "An object value"
                })
        },
        

        /**
         * This assertion passes, if supplied value is an Array
         * 
         * @param {Mixed} value The value to check.
         * @param {String} desc The description of the assertion
         */
        isArray : function (value, desc) {
            if (this.typeOf(value) == 'Array')
                this.pass(desc, {
                    descTpl     : '{value} is an array',
                    value       : value
                })
            else
                this.fail(desc, {
                    got         : value,
                    need        : "An array value"
                })
        },


        /**
         * This assertion passes, if supplied value is a Number.
         * 
         * @param {Mixed} value The value to check.
         * @param {String} desc The description of the assertion
         */
        isNumber : function (value, desc) {
            if (this.typeOf(value) == 'Number')
                this.pass(desc, {
                    descTpl     : '{value} is a number',
                    value       : value
                })
            else
                this.fail(desc, {
                    got         : value,
                    need        : "A number value"
                })
        },


        /**
         * This assertion passes, if supplied value is a Boolean.
         * 
         * @param {Mixed} value The value to check.
         * @param {String} desc The description of the assertion
         */
        isBoolean : function (value, desc) {
            if (this.typeOf(value) == 'Boolean')
                this.pass(desc, {
                    descTpl     : '{value} is a boolean',
                    value       : value
                })
            else
                this.fail(desc, {
                    got         : value,
                    need        : "A boolean value"
                })
        },

        
        /**
         * This assertion passes, if supplied value is a Date.
         * 
         * @param {Mixed} value The value to check.
         * @param {String} desc The description of the assertion
         */
        isDate : function (value, desc) {
            if (this.typeOf(value) == 'Date')
                this.pass(desc, {
                    descTpl     : '{value} is a date',
                    value       : value
                })
            else
                this.fail(desc, {
                    got         : value,
                    need        : "A date value"
                })
        },

        
        /**
         * This assertion passes, if supplied value is a RegExp.
         * 
         * @param {Mixed} value The value to check.
         * @param {String} desc The description of the assertion
         */
        isRegExp : function (value, desc) {
            if (this.typeOf(value) == 'RegExp')
                this.pass(desc, {
                    descTpl     : '{value} is a regular expression',
                    value       : value
                })
            else
                this.fail(desc, {
                    got         : value,
                    need        : "A regular expression value"
                })
        },
        
        
        /**
         * This assertion passes, if supplied value is a Function.
         * 
         * @param {Mixed} value The value to check.
         * @param {String} desc The description of the assertion
         */
        isFunction : function (value, desc) {
            if (this.typeOf(value) == 'Function')
                this.pass(desc, {
                    descTpl     : '{value} is a function',
                    value       : value
                })
            else
                this.fail(desc, {
                    got         : value,
                    need        : "A function value"
                })
        },        
        
        
        is_deeply : function (obj1, obj2, desc) {
            this.isDeeply.apply(this, arguments)
        },
        
        /**
         * This assertion passes when in-depth comparison of 1st and 2nd arguments (which are assumed to be JSON objects) shows that they are equal.
         * Comparison is performed with '==' operator, so `[ 1 ]` and `[ "1" ] objects will be equal. The objects should not contain cyclic references.
         * 
         * This method works correctly with the *placeholders* generated with method {@link #any}.
         * 
         * This method has a synonym: `is_deeply`
         * 
         * @param {Object} obj1 The 1st object to compare
         * @param {Object} obj2 The 2nd object to compare
         * @param {String} desc The description of the assertion
         */
        isDeeply : function (obj1, obj2, desc) {
            if (this.typeOf(obj1) === this.typeOf(obj2) && this.compareObjects(obj1, obj2))
                this.pass(desc, {
                    descTpl             : '{obj1} is deeply equal to {obj2}',
                    obj1                : obj1,
                    obj2                : obj2
                })
            else
                this.fail(desc, {
                    assertionName       : 'isDeeply', 
                    got                 : obj1, 
                    need                : obj2 
                })
        },
        
        
        /**
         * This assertion passes when in-depth comparison of 1st and 2nd arguments (which are assumed to be JSON objects) shows that they are equal.
         * Comparison is performed with '===' operator, so `[ 1 ]` and `[ "1" ] objects will be different. The objects should not contain cyclic references.
         * 
         * This method works correctly with the *placeholders* generated with method {@link #any}.
         * 
         * @param {Object} obj1 The 1st object to compare
         * @param {Object} obj2 The 2nd object to compare
         * @param {String} desc The description of the assertion
         */
        isDeeplyStrict : function (obj1, obj2, desc) {
            if (this.typeOf(obj1) === this.typeOf(obj2) && this.compareObjects(obj1, obj2, true))
                this.pass(desc, {
                    descTpl             : '{obj1} is strictly deeply equal to {obj2}',
                    obj1                : obj1,
                    obj2                : obj2
                })
            else
                this.fail(desc, {
                    assertionName       : 'isDeeplyStrict', 
                    got                 : obj1, 
                    need                : obj2 
                })
        },
        
        expectGlobal : function () {
            this.expectGlobals.apply(this, arguments)
        },
        
        
        /**
         * This method accepts a variable number of names of expected properties in the global scope. When verifying the globals with {@link #verifyGlobals}
         * assertions, the expected gloabls will not be counted as failed assertions.
         * 
         * This method has a synonym with singular name: `expectGlobal`
         * 
         * @param {String/RegExp} name1 The name of global property or the regular expression to match several properties
         * @param {String/RegExp} name2 The name of global property or the regular expression to match several properties
         * @param {String/RegExp} nameN The name of global property or the regular expression to match several properties
         */
        expectGlobals : function () {
            this.expectedGlobals.push.apply(this.expectedGlobals, arguments)
        },
        
        
        /**
         * This method accepts a variable number of names of expected properties in the global scope and then performs a globals check. 
         *
         * It will scan all globals properties in the scope of test and compare them with the list of expected globals. Expected globals can be provided with:
         * {@link #expectGlobals} method or {@link Siesta.Harness#expectedGlobals expectedGlobals} configuration option of harness.
         * 
         * You can enable this assertion to automatically happen at the end of each test, using {@link Siesta.Harness#autoCheckGlobals autoCheckGlobals} option of the harness.
         * 
         * @param {String/RegExp} name1 The name of global property or the regular expression to match several properties
         * @param {String/RegExp} name2 The name of global property or the regular expression to match several properties
         * @param {String/RegExp} nameN The name of global property or the regular expression to match several properties
         */
        verifyGlobals : function () {
            if (this.disableGlobalsCheck) {
                this.diag('Testing leakage of global variables is not supported on this platform')
                
                return
            }
            
            this.expectGlobals.apply(this, arguments)
            
            var me                  = this
            var expectedStrings     = {}
            var expectedRegExps     = []
            
            Joose.A.each(this.expectedGlobals.concat(this.browserGlobals), function (value) {
                if (me.typeOf(value) == 'RegExp')
                    expectedRegExps.push(value)
                else
                    expectedStrings[ value ] = true 
            })
            
            this.diag('Global variables')
            
            var failed              = false
            
            for (var name in this.global) {
                if (expectedStrings[ name ]) continue
                
                var isExpected      = false
                
                for (var i = 0; i < expectedRegExps.length; i++) {
                    if (expectedRegExps[ i ].test(name)) {
                        isExpected = true
                        break
                    }
                }
                
                if (!isExpected) {
                    me.fail('Unexpected global found', 'Global name: ' + name + ', value: ' + Siesta.Util.Serializer.stringify(this.global[name]))
                    
                    failed      = true
                }
            }
            
            if (!failed) this.pass('No unexpected global variables found')
        },
        
        
        // will create a half-realized, "phantom", "isWaitFor" assertion, which is only purposed
        // for user to get the instant feedback about "waitFor" actions
        // this assertion will be "finalized" and added to the test results in the "finalizeWaiting"
        startWaiting : function (description, sourceLine) {
            var result = new Siesta.Result.Assertion({
                description     : description,
                isWaitFor       : true,
                sourceLine      : sourceLine
            });
            
            this.fireEvent('testupdate', this, result, this.getResults())
            
            return result;
        },
        
        
        finalizeWaiting : function (result, passed, desc, annotation, errback) {
            // Treat this is an ordinary assertion from now on
            result.completed = true;
            
            if (passed)
                this.pass(desc, annotation, result)
            else {
                this.fail(desc, annotation, result);
                
                errback && errback()
            }
        },
        
        
        /**
         * Waits for passed checker method to return true (or any non-false value, like for example DOM element or array), and calls the callback when this happens.
         * As an additional feature, the callback will receive the result from the checker method as the 1st argument.
         * 

    t.waitFor(
        function () { return document.getElementById('someEl') },
        function (el) {
            // waited for element #someEl to appear
            // element will be available in the callback as 1st argument "el"
        }
    })

         * You can also call this method with a single Object having the following properties: `method`, `callback`, `scope`, `timeout`, `interval`:

    t.waitFor({
        method      : function () { return document.getElementById('someEl') },
        callback    : function (el) {
            // waited for element #someEl to appear
            // element will be available in the callback as 1st argument "el"
        }
    })

         * 
         * @param {Object/Function/Number} method Either a function which should return true when a certain condition has been fulfilled, or a number of ms to wait before calling the callback. 
         * @param {Function} callback A function to call when the condition has been met. Will receive a result from checker function.
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time (in milliseconds) to wait for the condition to be fulfilled. 
         * Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. If condition is not fullfilled within this time, a failed assertion will be added to the test. 
         * @param {Int} [interval=100] The polling interval (in milliseconds)
         * 
         * @return {Object} An object with the following properties:
         * @return {Function} return.force A function, that will force this wait operation to immediately complete (and call the callback). 
         * No call to checker will be performed and callback will not receive a result from it. 
         */
        waitFor : function (method, callback, scope, timeout, interval)  {
            var description         = ' condition to be fullfilled';
            var assertionName       = 'waitFor';
            var errback

            if (arguments.length === 1 && this.typeOf(method) == 'Object') {
                var options     = method;
                
                method          = options.method;
                callback        = options.callback;
                scope           = options.scope;
                timeout         = options.timeout;
                interval        = options.interval
                
                description     = options.description || description;
                assertionName   = options.assertionName || assertionName;
                
                // errback is called in case "waitFor" has failed
                errback         = options.errback
            }
            
            var isWaitingForTime        = this.typeOf(method) == 'Number'

            var description             = isWaitingForTime ? (method + ' ms') : description;
            var me                      = this;
            
            callback                    = callback || function () {}
            
            var sourceLine              = me.getSourceLine();
            var originalSetTimeout      = me.originalSetTimeout;
            var originalClearTimeout    = me.originalClearTimeout;
            var pollTimeout
            
            // early notification about the started "waitFor" operation
            var waitAssertion           = me.startWaiting('Waiting for ' + description, sourceLine);
            
            interval                    = interval || this.waitForPollInterval
            timeout                     = timeout || this.waitForTimeout
            
            // this async frame not supposed to fail, because its delayed to `timeout + 3 * interval`
            // failure supposed to be generated in the "pollFunc" and this async frame to be closed
            // however, in IE it happens that async frame may end earlier than failure from "pollFunc"
            // in such case we report same error as in "pollFunc"
            var async                   = this.beginAsync((isWaitingForTime ? method : timeout) + 3 * interval, function () {
                originalClearTimeout(pollTimeout)
                
                me.finalizeWaiting(waitAssertion, false, 'Waited too long for: ' + description, {
                    assertionName       : assertionName,
                    annotation          : 'Condition was not fullfilled during ' + timeout + 'ms'
                }, errback)
                
                return true
            })
            
            var isDone      = false

            // stop polling, if this test instance has finalized (probably because of exception)
            this.on('beforetestfinalize', function () {
                if (!isDone) {
                    isDone      = true
                    
                    me.finalizeWaiting(waitAssertion, false, 'Waiting aborted');
                    me.endAsync(async)
                    
                    originalClearTimeout(pollTimeout)
                }
            }, null, { single : true })

            if (isWaitingForTime) {
                pollTimeout = originalSetTimeout(function() {
                    isDone      = true
                    
                    me.finalizeWaiting(waitAssertion, true, 'Waited ' + method + ' ms');
                    me.endAsync(async);
                    me.processCallbackFromTest(callback, [], scope || me)
                }, method);
                
            } else {
            
                var startDate   = new Date()
            
                var pollFunc    = function () {
                    var time = new Date() - startDate;
                    
                    if (time > timeout) {
                        me.endAsync(async);

                        me.finalizeWaiting(waitAssertion, false, 'Waited too long for: ' + description, {
                            assertionName       : assertionName,
                            annotation          : 'Condition was not fullfilled during ' + timeout + 'ms'
                        }, errback)
                        
                        isDone      = true
                    
                        return
                    }
                
                    try {
                        var result = method.call(scope || me);
                    } catch (e) {
                        me.endAsync(async);
                    
                        me.finalizeWaiting(waitAssertion, false, assertionName + ' checker threw an exception', {
                            assertionName       : assertionName,
                            got                 : e.toString(),
                            gotDesc             : "Exception"
                        }, errback)
                    
                        isDone      = true
                        
                        return
                    }
                
                    if (result != null && result !== false) {
                        me.endAsync(async);
                        
                        isDone      = true
                        
                        me.finalizeWaiting(waitAssertion, true, 'Waited ' + time + ' ms for ' + description);
                        
                        me.processCallbackFromTest(callback, [ result ], scope || me)
                    } else 
                        pollTimeout = originalSetTimeout(pollFunc, interval)
                }
            
                pollFunc()
            }
            
            return {
                force : function () {
                    // wait operation already completed 
                    if (isDone) return
                    
                    isDone      = true
                    
                    originalClearTimeout(pollTimeout)
                    
                    me.endAsync(async);
                    
                    me.finalizeWaiting(waitAssertion, true, 'Forced finalization of waiting for ' + description);
                    
                    me.processCallbackFromTest(callback, [], scope || me)
                }
            }
        },

        /**
         * Waits for the number of a number millseconds and calls the callback when after waiting. This is just a convenience synonym for the {@link #waitFor} method.

         t.waitForMs(1500, callback)

         *
         * @param {Number} method The number of ms to wait before calling the callback.
         * @param {Function} callback A function to call when the condition has been met. Will receive a result from checker function.
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time (in milliseconds) to wait for the condition to be fulfilled.
         * Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. If condition is not fullfilled within this time, a failed assertion will be added to the test.
         * @param {Int} [interval=100] The polling interval (in milliseconds)
         *
         * @return {Object} An object with the following properties:
         * @return {Function} return.force A function, that will force this wait operation to immediately complete (and call the callback).
         * No call to checker will be performed and callback will not receive a result from it.
         */
        waitForMs : function() {
            return this.waitFor.apply(this, arguments);
        },
        

        /**
         * Waits for the passed checker method to return true (or any non-false value, like for example DOM element or array), and calls the callback when this happens.
         * This is just a convenience synonym for the {@link #waitFor} method.
         *

         t.waitForFn(function() { return true; }, callback)

         *
         * @param {Function} fn The checker function.
         * @param {Function} callback A function to call when the condition has been met. Will receive a result from checker function.
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time (in milliseconds) to wait for the condition to be fulfilled.
         * Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. If condition is not fullfilled within this time, a failed assertion will be added to the test.
         * @param {Int} [interval=100] The polling interval (in milliseconds)
         *
         * @return {Object} An object with the following properties:
         * @return {Function} return.force A function, that will force this wait operation to immediately complete (and call the callback).
         * No call to checker will be performed and callback will not receive a result from it.
         */
        waitForFn : function() {
            return this.waitFor.apply(this, arguments);
        },
        
        // takes the step function and tries to analyze if it is missing the call to "next"
        // returns "true" if "next" is used, 
        analyzeChainStep : function (func) {
            var sources         = func.toString()
            var firstArg        = sources.match(/function\s*[^(]*\(\s*(.*?)\s*(?:,|\))/)[ 1 ]
                        
            if (!firstArg) return false
            
            var body            = sources.match(/\{([\s\S]*)\}/)[ 1 ]
            
            return body.indexOf(firstArg) != -1
        },
        
        
        /**
         * This method accept either variable number of arguments (steps) or the array of them. 
         * Each step should be either a function or configuration object for test actions. 
         * These functions / actions will be executed in order.
         * 
         * 1) If step is a function, as the 1st argument, it will receive a callback to call when the step is completed. 
         * As the 2nd and further arguments, the step function will receive the arguments passed to the previous callback.
         * 
         * The last step will receive a no-op callback, which can be ignored or still called. **Note**, that last step is assumed to
         * complete synchronously! If you need to launch some asynchronous process in the last step, you may need to add another empty function step
         * to the end of the chain.
         * 
         * 2) If a step is presented with action configuration object, then the callback will be called by the action class automatically,
         * there's no need to provide any. Configuration object should contain the "action" property, specifying the action class 
         * and some other config options (depending from the action class). For brevity, instead of "action" property, configuration 
         * object may contain the property corresponding to the action name itself, with the action's target. See the following examples and also
         * refer to the documentation of the action classes. 
         * 
         * If configuration object will contain a "desc" property, a passing assertion with it value will be added to the test, after this step completion.
         * 
         * 3) If step is a sub test instance, created with {@link #getSubTest} method, then step will launch it.
         * 
         * Its better to see how it works on the example. For example, when using using only functions:
         
    t.chain(
        // function receives a callback as 1st argument
        function (next) {
            // we pass that callback to the "click" method
            t.click(buttonEl, next)
        },
        function (next) {
            t.type(fieldEl, 'Something', next)
        },
        function (next) {
            t.is(fieldEl.value == 'Something', 'Correct value in the field')
            
            // call the callback with some arguments
            next('foo', 'bar')  
        }, 
        // those arguments are now available as arguments of next step
        function (next, value1, value2) {
            t.is(value1, 'foo', 'The arguments for the callback are translated to the arguments of the step')
            t.is(value2, 'bar', 'The arguments for the callback are translated to the arguments of the step')
        }
    )

         * 
         * The same example, using action configuration objects for first 2 steps. For the list of available actions please refer to the classes in the Siesta.Test.Action namespace.
         
    t.chain(
        {
            action      : 'click',
            target      : buttonEl,
            desc        : "Clicked on the button"
        },
        // or
        {
            click       : buttonEl,
            desc        : "Clicked on the button"
        },

        {
            action      : 'type',
            target      : fieldEl,
            text        : 'Something',
            desc        : "Typed in the field"
        },
        // or
        {
            type        : 'Something',
            target      : fieldEl,
            desc        : "Typed in the field"
        },
        
        
        function (next) {
            t.is(fieldEl.value == 'Something', 'Correct value in the field')
            
            next('foo', 'bar')  
        }, 
        ...
    )
    
         * Please note, that by default, each step is expected to complete within the {@link Siesta.Harness#defaultTimeout} time. 
         * You can change this with the `timeout` property of the step configuration object, allowing some steps to last longer.
         * Steps with sub-tests are expected to complete within {@link Siesta.Harness#subTestTimeout}.
         * 
         * In a special case, `action` property of the step configuration object can be a function. In this case you can also 
         * provide a `timeout` property, otherwise this case is identical to using functions:
         *  

    t.chain(
        {
            action      : function (next) { ... },
            // allow 50s for the function to call "next" before step will be considered timed-out
            timeout     : 50000
        },
        ...
    )
    
         *  **Tip**:
         *  
         *  If step is presented with a `null` or `undefined` value it will be ignored. Additionally, the step may be presented 
         *  with an array of steps - all arrays in the input will be flattened.
         *  
         *  These tips allows us to implement conditional steps processing, like this:
         *  

    var el1IsInDom          = t.$('.some-class1')[ 0 ]
    var el2IsInDom          = t.$('.some-class2')[ 0 ]
    
    t.chain(
        { click : '.some-other-el' },
        
        el1IsInDom ? [
            { click : el1IsInDom },
            
            el2IsInDom ? [
                { click : el1IsInDom },
            ] : null,
        ] : null,
        
        ...
    )

         *  
         *  @param {Function/Object/Array} step1 The function to execute or action configuration, or the array of such
         *  @param {Function/Object} step2 The function to execute or action configuration
         *  @param {Function/Object} stepN The function to execute or action configuration
         */
        chain : function () {
            // inline any arrays in the arguments into one array
            var steps       = this.flattenArray(arguments)
            
            var nonEmpty    = []
            Joose.A.each(steps, function (step) { if (step) nonEmpty.push(step) })
            
            steps           = nonEmpty
            
            var len         = steps.length
            
            // do nothing
            if (!len) return;
            
            var me          = this
            var self        = arguments.callee
            
            var queue       = new Siesta.Util.Queue({
                deferer         : this.originalSetTimeout,
                deferClearer    : this.originalClearTimeout,
                
                interval        : self.hasOwnProperty('actionDelay') ? self.actionDelay : this.actionDelay,
                
                observeTest     : this
            })
            
            // hack to allow configuration of `actionDelay`...
            delete self.actionDelay
            
            var sourceLine  = me.getSourceLine();
            
            var args        = []
            
            Joose.A.each(steps, function (step, index) {
                
                var isLast      = index == len - 1
                
                queue.addAsyncStep({
                    processor : function (data) {
                        var isStepWithOwnAsyncFrame  = step.action == 'wait' || step.waitFor || (step instanceof Siesta.Test)
                        
                        if (!isStepWithOwnAsyncFrame) {
                            var timeout     = step.timeout || me.defaultTimeout
                            
                            // + 100 to allow `waitFor` steps (which will be waiting the `timeout` time) to
                            // generate their own failures
                            var async       = me.beginAsync(timeout + 100, function () {
                                me.fail(
                                    'The step in `t.chain()` call did not complete within required timeframe, chain can not proceed',
                                    {
                                        sourceLine      : sourceLine,
                                        annotation      : 'Step number: ' + (index + 1) + ' (1-based)' + (sourceLine ? '\nAt line    : ' + sourceLine : ''),
                                        ownTextOnly     : true
                                    }
                                )
                                
                                return true
                            })
                        }
                        
                        var nextFunc    = function () {
                            if (!isStepWithOwnAsyncFrame) me.endAsync(async)
                            
                            args    =  Array.prototype.slice.call(arguments);
                            
                            if (step.desc) {
                                me.pass(step.desc);
                            }
                            data.next()
                        }
                        
                        if (step instanceof Siesta.Test) {
                            me.launchSubTest(step, nextFunc)
                        } else if (me.typeOf(step) == 'Function' || me.typeOf(step.action) == 'Function') {
                            var func    = me.typeOf(step) == 'Function' ? step : step.action
                            
                            // if the last step is a function - then provide "null" as the "next" callback for it
                            args.unshift(isLast ? function () {} : nextFunc)
                            
                            if (!isLast && !me.analyzeChainStep(func)) me.fail('Step function [' + func.toString() + '] does not use provided "next" function anywhere')
                            
                            if (me.transparentEx)
                                func.apply(me, args)
                            else {
                                var e = me.getExceptionCatcher()(function () {
                                    func.apply(me, args)
                                })
                                
                                if (e !== undefined) {
                                    me.fail("Chain step threw an exception", { annotation : e + '' })
                                }
                            }
                            
                            // and finalize the async frame manually, as the "nextFunc" for last step will never be called
                            isLast && me.endAsync(async)
                            
                        } else if (me.typeOf(step) == 'String') {
                            var action      = new Siesta.Test.Action.Eval({
                                actionString        : step,
                                next                : nextFunc,
                                test                : me
                            })
                            
                            action.process()
                            
                        } else {
                            if (!step.args) step.args   = args
                            
                            // Don't pass target to next step if it is a waitFor action, it does not make sense and messes up the arguments
                            if (!isLast && (steps[ index + 1 ].waitFor || steps[ index + 1 ].action == 'wait')) {
                                step.passTargetToNext = false;
                            }

                            step.next       = nextFunc
                            step.test       = me
                            
                            var action      = Siesta.Test.ActionRegistry().create(step)
                            
                            action.process()
                        }
                    } 
                })
            })
            
            queue.run()
        }
    },
    
    
    after : {
        
        initialize        : function () {
            
            this.on('beforetestfinalize', function () {
                
                if (this.autoCheckGlobals && !this.isFailed() && !this.parent) this.verifyGlobals()
                
            }, this)
        }
    }
        
})
//eof Siesta.Test.More
