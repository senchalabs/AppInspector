/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.BDD.Expectation

This class is a central point for writing assertions in the BDD style. Instances of this class can be generated with the {@link Siesta.Test#expect expect}
method. Then, calling some method on the instance will create a new assertion in the test.

* **Note**, that to negate any assertion, you can use a special property {@link #not}, that also contains an expectation instance, but with the opposite meaning.

For example:

    t.expect(1).toBe(1)
    t.expect(1).not.toBe(2)
    
    t.expect('Foo').toContain('oo')
    t.expect('Foo').not.toContain('bar')


*/
Class('Siesta.Test.BDD.Expectation', {
    
    has         : {
        value           : null,
        
        isNot           : false,
        
        /**
         * @property {Siesta.Test.BDD.Expectation} not Another expectation instance with the negated meaning. 
         */
        not             : null,
        
        t               : null
    },
    
    
    methods     : {
        
        initialize : function () {
            if (!this.isNot) this.not = new this.constructor({
                isNot           : true,
                t               : this.t,
                
                value           : this.value
            })
        },
        
        
        process : function (passed, config) {
            var isNot       = this.isNot
            config          = config || {}
            
            config.not      = config.not || isNot ? 'not ' : ''
            config.got      = config.hasOwnProperty('got') ? config.got : this.value
            
            if (config.noGot) delete config.got
            
            var assertionName   = config.assertionName
            
            if (assertionName && isNot) config.assertionName = assertionName.replace(/^(expect\(.+?\)\.)/, '$1not.')
            
            passed          = isNot ? !passed : passed
            
            this.t[ passed ? 'pass' : 'fail' ](null, config)
        },
        
        
        /**
         * This assertion compares the value provided to the {@link Siesta.Test#expect expect} method with the `expectedValue` argument.
         * Comparison is done with `===` operator, so it should be used only with the primitivies - numbers, strings, booleans etc.
         * To deeply compare JSON objects and arrays, use {@link #toEqual} method.
         * 
         * This method works correctly with the placeholders generated with {@link Siesta.Test#any any} method
         * 
         * @param {Primitive} expectedValue An expected value 
         */
        toBe : function (expectedValue) {
            this.process(this.t.compareObjects(this.value, expectedValue, true, true), {
                descTpl             : 'Expect {got} {!not}to be {need}',
                assertionName       : 'expect(got).toBe(need)',
                need                : expectedValue,
                needDesc            : this.isNot ? 'Need not' : 'Need'
            })
        },
        
        
        /**
         * This assertion compares the value provided to the {@link Siesta.Test#expect expect} method with the `expectedValue` argument.
         * Comparison works for JSON objects and/or arrays, it is performed "deeply". Right now the values should not contain cyclic references.
         * 
         * This method works correctly with the placeholders generated with {@link Siesta.Test#any any} method
         * 
         * @param {Mixed} expectedValue An expected value 
         */
        toEqual : function (expectedValue) {
            this.process(this.t.compareObjects(this.value, expectedValue, true), {
                descTpl             : 'Expect {got} {!not}to be equal to {need}',
                assertionName       : 'expect(got).toEqual(need)',
                need                : expectedValue,
                needDesc            : this.isNot ? 'Need not' : 'Need'
            })
        },
        
        
        /**
         * This assertion passes, when value provided to the {@link Siesta.Test#expect expect} method is `null`.
         */
        toBeNull : function () {
            this.process(this.t.compareObjects(this.value, null, true, true), {
                descTpl             : 'Expect {got} {!not}to be null',
                assertionName       : 'expect(got).toBeNull()',
                need                : null,
                needDesc            : this.isNot ? 'Need not' : 'Need'
            })
        },
        
        
        /**
         * This assertion passes, when value provided to the {@link Siesta.Test#expect expect} method is `NaN`.
         */
        toBeNaN : function () {
            var value   = this.value
            
            this.process(this.t.typeOf(value) == 'Number' && value != value, {
                descTpl             : 'Expect {got} {!not}to be NaN',
                assertionName       : 'expect(got).toBeNaN()',
                need                : NaN,
                needDesc            : this.isNot ? 'Need not' : 'Need'
            })
        },

        
        /**
         * This assertion passes, when value provided to the {@link Siesta.Test#expect expect} method is not the `undefined` value.
         */
        toBeDefined : function () {
            this.process(this.value !== undefined, {
                descTpl             : 'Expect {got} {!not}to be defined',
                assertionName       : 'expect(got).toBeDefined()'
            })
        },
        
        
        /**
         * This assertion passes, when value provided to the {@link Siesta.Test#expect expect} method is the `undefined` value.
         */
        toBeUndefined : function (value) {
            this.process(this.value === undefined, {
                descTpl             : 'Expect {got} {!not}to be undefined',
                assertionName       : 'expect(got).toBeUndefined()'
            })
        },
        
        
        /**
         * This assertion passes, when value provided to the {@link Siesta.Test#expect expect} method is "truthy" - evaluates to `true`.
         * For example - non empty strings, numbers except the 0, objects, arrays etc.
         */
        toBeTruthy : function () {
            this.process(this.value, {
                descTpl             : 'Expect {got} {!not}to be truthy',
                assertionName       : 'expect(got).toBeTruthy()'
            })
        },
        
        
        /**
         * This assertion passes, when value provided to the {@link Siesta.Test#expect expect} method is "falsy" - evaluates to `false`.
         * For example - empty strings, number 0, `null`, `undefined`, etc.
         */
        toBeFalsy : function () {
            this.process(!this.value, {
                descTpl             : 'Expect {got} {!not}to be falsy',
                assertionName       : 'expect(got).toBeFalsy()'
            })
        },
        
        
        /**
         * This assertion passes, when the string provided to the {@link Siesta.Test#expect expect} method matches the regular expression.
         * 
         * @param {RegExp} regexp The regular expression to match the string against
         */
        toMatch : function (regexp) {
            if (this.t.typeOf(regexp) != 'RegExp') throw new Error("`expect().toMatch()` matcher expects a regular expression")
            
            this.process(new RegExp(regexp).test(this.value), {
                descTpl             : 'Expect {got} {!not}to match {need}',
                assertionName       : 'expect(got).toMatch(need)',
                need                : regexp,
                needDesc            : this.isNot ? 'Need not matching' : 'Need matching'
            })
        },
        
        
        /**
         * This assertion passes in 2 cases:
         * 
         * 1) When the value provided to the {@link Siesta.Test#expect expect} method is a string, and it contains a passed substring.
         * 2) When the value provided to the {@link Siesta.Test#expect expect} method is an array (or array-like), and it contains a passed element.
         * 
         * @param {String/Mixed} element The element of the array or a sub-string
         */
        toContain : function (element) {
            var value       = this.value
            var t           = this.t
            
            var passed      = false

            if (t.typeOf(value) == 'String') {
                this.process(value.indexOf(element) >= 0, {
                    descTpl             : 'Expect {got} {!not}to contain {need}',
                    assertionName       : 'expect(got).toContain(need)',
                    need                : element,
                    needDesc            : this.isNot ? 'Need string not containing' : 'Need string containing'
                })
            } else {
                // Normalize to allow NodeList, Arguments etc.
                value = Array.prototype.slice.call(value);

                for (var i = 0; i < value.length; i++)
                    if (t.compareObjects(element, value[ i ], true)) {
                        passed      = true
                        break
                    }

                this.process(passed, {
                    descTpl             : 'Expect {got} {!not}to contain {need}',
                    assertionName       : 'expect(got).toContain(need)',
                    need                : element,
                    needDesc            : this.isNot ? 'Need array not containing' : 'Need array containing'
                })

            }
        },
        
        
        /**
         * This assertion passes, when the number provided to the {@link Siesta.Test#expect expect} method is less than the
         * expected number.
         * 
         * @param {Number} expectedValue The number to compare with
         */
        toBeLessThan : function (expectedValue) {
            this.process(this.value < expectedValue, {
                descTpl             : 'Expect {got} {!not}to be less than {need}',
                assertionName       : 'expect(got).toBeLessThan(need)',
                need                : expectedValue,
                needDesc            : this.isNot ? 'Need value bigger or equal than' : 'Need value less than'
            })
        },
        
        
        /**
         * This assertion passes, when the number provided to the {@link Siesta.Test#expect expect} method is greater than the
         * expected number.
         * 
         * @param {Number} expectedValue The number to compare with
         */
        toBeGreaterThan : function (expectedValue) {
            this.process(this.value > expectedValue, {
                descTpl             : 'Expect {got} {!not}to be greater than {need}',
                assertionName       : 'expect(got).toBeGreaterThan(need)',
                need                : expectedValue,
                needDesc            : this.isNot ? 'Need value less or equal than' : 'Need value greater than'
            })
        },
        
        
        /**
         * This assertion passes, when the number provided to the {@link Siesta.Test#expect expect} method is approximately equal
         * the given number. The proximity can be defined as the `precision` argument  
         * 
         * @param {Number} expectedValue The number to compare with
         * @param {Number} [precision=2] The number of digits after dot (comma) that should be same in both numbers.
         */
        toBeCloseTo : function (expectedValue, precision) {
            precision       = precision != null ? precision : 2
            
            // not sure why we divide the precision by 2, but jasmine does that for some reason
            var threshold   = Math.pow(10, -precision) / 2
            var delta       = Math.abs(this.value - expectedValue)
            
            this.process(delta < threshold, {
                descTpl             : 'Expect {got} {!not}to be close to {need}',
                assertionName       : 'expect(got).toBeCloseTo(need)',
                need                : expectedValue,
                needDesc            : this.isNot ? 'Need value not close to' : 'Need value close to',
                annotation          : delta ? "Threshold is " + threshold : 'Exact match'
            })        
        },
        
        
        /**
         * This assertion passes when the function, provided to the {@link Siesta.Test#expect expect} method, throws any exception
         * during its execution.
         */
        toThrow : function () {
            var func    = this.value
            var t       = this.t
            
            if (t.typeOf(func) != 'Function') throw new Error("`expect().toMatch()` matcher expects a function")
            
            var e       = t.getExceptionCatcher()(func)
            
            if (e instanceof t.getTestErrorClass())
                //IE uses non-standard 'description' property for error msg
                e = e.message || e.description
                
            this.process(e !== undefined, {
                descTpl             : 'Expect function {!not}to throw exception',
                assertionName       : 'expect(func).toThrow()',
                annotation          : e ? "Thrown exception: " + Siesta.Util.Serializer.stringify(e) : 'No exception thrown',
                
                noGot               : true
            })
        },
        
        
        // TODO
        toHaveBeenCalled : function () {
        },
        
        
        // TODO
        toHaveBeenCalledWith : function () {
        }
    }
})
