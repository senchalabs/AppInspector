/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.Eval
@extends Siesta.Test.Action

This action can be included in the `t.chain` steps only with a plain string. Siesta will examine the passed string,
and call an apropriate method of the test class. String should have the following format: 
    
    methodName(params) 

Method name is anything until the first parenthes. Method name may have an optional prefix `t.`. 
Everything in between of outermost parentheses will be treated as parameters for method call. For example:

    t.chain(
        // string should look like a usual method call, 
        // but arguments can't reference any variables
        // strings should be quoted, to include quoting symbol in string use double slash: \\
        't.click("combo[type=some\\"Type] => .x-form-trigger")',
        
        // leading "t." is optional, but quoting is not
        'waitForComponent("combo[type=someType]")',
        
        // JSON objects are ok, but they should be a valid JSON - ie object properties should be quoted
        'myClick([ 10, 10 ], { "foo" : "bar" })',
    )
    
* **Note** You can pass the JSON objects as arguments, but they should be serialized as valid JSON - ie object properties should be quoted.
    
* **Note** A callback for next step in chain will be always appended to provided parameters. Make sure it is placed in a correct spot!
For example if method signature is `t.someMethod(param1, param2, callback)` and you are calling this method as:
    
    t.chain(
        `t.someMethod("text")`
    )
it will fail - callback will be provided in place of `param2`. Instead call it as: 
    
    t.chain(
        `t.someMethod("text", null)`
    )

This action may save you few keystrokes, when you need to perform some action with static arguments (known prior the action).

*/
Class('Siesta.Test.Action.Eval', {
    
    isa         : Siesta.Test.Action,
    
    has : {
        /**
         * @cfg {Object} options
         *
         * Any options that will be used when simulating the event. For information about possible
         * config options, please see: <https://developer.mozilla.org/en-US/docs/DOM/event.initMouseEvent>
         */
        actionString        : null
    },

    
    methods : {
        
        process : function () {
            var test            = this.test
            var parsed          = this.parseActionString(this.actionString)
            
            if (parsed.error) {
                test.fail(parsed.error)
                this.next()
                return
            }
            
            var methodName      = parsed.methodName
            
            if (!methodName || test.typeOf(test[ methodName ]) != 'Function') {
                test.fail("Invalid method name: " + methodName)
                this.next()
                return
            }
            
            parsed.params.push(this.next)
            
            test[ methodName ].apply(test, parsed.params)
        },
        
        
        parseActionString : function (actionString) {
            var match           = /^\s*(.+?)\(\s*(.*)\s*\)\s*$/.exec(actionString)
            
            if (!match) return {
                error       : "Wrong format of the action string: " + actionString
            }
            
            var methodName      = match[ 1 ].replace(/^t\./, '')
            
            try {
                var params      = JSON.parse('[' + match[ 2 ] + ']')
            } catch (e) {
                return {
                    error       : "Can't parse arguments: " + match[ 2 ]
                }
            }
            
            return {
                methodName      : methodName,
                params          : params
            }
        }
    }
});
