/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.BDD

A mixin providing a BDD style layer for most of the assertion methods.
It is consumed by {@link Siesta.Test}, so all of its methods are available in all tests. 

*/
Role('Siesta.Test.BDD', {
    
    requires    : [
        'getSubTest', 'chain'
    ],
    
    has         : {
        specType                : null, // `describe` or `it`
        
        sequentialSubTests      : Joose.I.Array,
        
        // flag, whether the "run" function of the test (containing actual test code) have been already run
        codeProcessed           : false,
        
        launchTimeout           : null,
        
        // Siesta.Test.BDD.Expectation should already present on the page
        expectationClass        : Siesta.Test.BDD.Expectation
    },
    
    
    methods     : {
        
        checkSpecFunction : function (func, type, name) {
            if (!func)          throw new Error("Code body is not provided for " + (type == 'describe' ? 'suite' : 'spec') + ' [' + name + ']')
            if (!func.length)   throw new Error("Code body of " + (type == 'describe' ? 'suite' : 'spec') + ' [' + name + '] does not declare a test instance as 1st argument')
        },
        
        
        /**
         * This is an "exclusive" version of the regular {@link #describe} suite. When such suites presents in some test file,
         * the other regular suites at the same level will not be executed, only "exclusive" ones.
         * 
         * @param {String} name The name or description of the suite
         * @param {Function} code The code function for this suite. It will receive a test instance as the first argument which should be used for all assertion methods.
         * @param {Number} [timeout] A maximum duration for this suite. If not provided {@link Siesta.Harness#subTestTimeout} value is used.
         */
        ddescribe : function (name, code, timeout) {
            this.describe(name, code, timeout, true)
        },
        
        
        /**
         * This is a no-op method, allowing you to quickly ignore some suites. 
         */
        xdescribe : function () {
        },
        
        
        /**
         * This method starts a sub test with *suite* (in BDD terms). Such suite consists from one or more *specs* (see method {@link #it}} or other suites.
         * The number of nesting levels is not limited. All suites of the same nesting level are executed sequentially. 
         * 
         * For example:
         * 
    t.describe('A product', function (t) {
    
        t.it('should have feature X', function (t) {
            ...
        })
        
        t.describe('feature X', function (t) {
            t.it('should be cool', function (t) {
                ...
            })
        })
    })
         *
         * See also {@link #xdescribe}, {@link #ddescribe}
         * 
         * @param {String} name The name or description of the suite
         * @param {Function} code The code function for this suite. It will receive a test instance as the first argument which should be used for all assertion methods.
         * @param {Number} [timeout] A maximum duration for this suite. If not provided {@link Siesta.Harness#subTestTimeout} value is used.
         */
        describe : function (name, code, timeout, isExclusive) {
            this.checkSpecFunction(code, 'describe', name)
            
            var subTest     = this.getSubTest({
                name            : name,
                run             : code,
                
                isExclusive     : isExclusive,
                
                specType        : 'describe',
                timeout         : timeout
            })
            
            if (this.codeProcessed) this.scheduleSpecsLaunch()
            
            this.sequentialSubTests.push(subTest)
        },
        
        
        /**
         * This is an "exclusive" version of the regular {@link #it} spec. When such specs presents in some suite,
         * the other regular specs at the same level will not be executed, only "exclusive" ones. Note, that even "regular" suites (`t.describe`) sections
         * will be ignored, if they are on the same level with the exclusive `iit` section.
         * 
         * @param {String} name The name or description of the spec
         * @param {Function} code The code function for this spec. It will receive a test instance as the first argument which should be used for all assertion methods.
         * @param {Number} [timeout] A maximum duration for this spec. If not provided {@link Siesta.Harness#subTestTimeout} value is used.
         */
        iit : function (name, code, timeout) {
            if (this.harness.isAutomated) {
                this.fail('t.iit should only be used during debugging');
            }
            this.it(name, code, timeout, true)
        },
        
        
        /**
         * This is a no-op method, allowing you to quickly ignore some specs. 
         */
        xit : function () {
        },
        
        
        /**
         * This method starts a sub test with *spec* (in BDD terms). Such spec consists from one or more assertions (or *expectations*, *matchers*, etc) or other nested specs
         * and/or suites. See the {@link #expect} method. The number of nesting levels is not limited. All specs of the same nesting level are executed sequentially. 
         * 
         * For example:
         * 
    t.describe('A product', function (t) {
    
        t.it('should have feature X', function (t) {
            ...
        })
        
        t.it('should have feature Y', function (t) {
            ...
        })
    })
         *
         * See also {@link #xit}, {@link #iit}
         * 
         * @param {String} name The name or description of the spec
         * @param {Function} code The code function for this spec. It will receive a test instance as the first argument which should be used for all assertion methods.
         * @param {Number} [timeout] A maximum duration for this spec. If not provided {@link Siesta.Harness#subTestTimeout} value is used.
         */
        it : function (name, code, timeout, isExclusive) {
            this.checkSpecFunction(code, 'it', name)
            
            var subTest     = this.getSubTest({
                name            : name,
                run             : code,
                
                isExclusive     : isExclusive,
                
                specType        : 'it',
                timeout         : timeout
            })
            
            if (this.codeProcessed) this.scheduleSpecsLaunch()
            
            this.sequentialSubTests.push(subTest)
        },
        
        
        /**
         * This method returns an "expectation" instance, which can be used to check various assertions about the passed value.
         * 
         * **Note**, that every expectation has a special property `not`, that contains another expectation, but with the negated meaning.
         * 
         * For example:
         * 

    t.expect(1).toBe(1)
    t.expect(1).not.toBe(2)
    
    t.expect('Foo').toContain('oo')
    t.expect('Foo').not.toContain('bar')
 
 
         * Please refer to the documentation of the {@link Siesta.Test.BDD.Expectation} class for the list of available methods.
         * 
         * @param {Mixed} value Any value, that will be assert about
         * @return {Siesta.Test.BDD.Expectation} Expectation instance
         */
        expect : function (value) {
            return new this.expectationClass({
                t           : this,
                value       : value
            })
        },
        
        
        /**
         * This method returns a *placeholder*, denoting any instance of the provided class constructor. Such placeholder can be used in various
         * comparison assertions, like {@link #is}, {@link #isDeeply}, {@link Siesta.Test.BDD.Expectation#toBe expect().toBe()}, 
         * {@link Siesta.Test.BDD.Expectation#toBe expect().toEqual()} and so on.
         * 
         * For example:

    t.is(1, t.any(Number))
    
    t.expect(1).toBe(t.any(Number))
    
    t.isDeeply({ name : 'John', age : 45 }, { name : 'John', age : t.any(Number))
    
    t.expect({ name : 'John', age : 45 }).toEqual({ name : 'John', age : t.any(Number))
    
    t.is(NaN, t.any(), 'When class constructor is not provided `t.any()` should match anything')

         * 
         * @param {Function} clsConstructor A class constructor instances of which are denoted with this placeholder. As a special case if this argument
         * is not provided, a placeholder will match any value. 
         * 
         * @return {Object} A placeholder object
         */
        any : function (clsConstructor) {
            return new Siesta.Test.BDD.Placeholder({
                clsConstructor      : clsConstructor,
                t                   : this,
                context             : this.global
            })
        },
        
        /**
         * This method returns a *placeholder*, denoting any number approximately equal to the provided value. 
         * Such placeholder can be used in various comparison assertions, like {@link #is}, {@link #isDeeply}, 
         * {@link Siesta.Test.BDD.Expectation#toBe expect().toBe()}, 
         * {@link Siesta.Test.BDD.Expectation#toBe expect().toEqual()} and so on.
         * 
         * For example:

    t.is(1, t.anyNumberApprox(1.2, 0.5))
    
    t.expect(1).toBe(t.any(Number))
    
         * 
         * @param {Number} value The approximate value
         * @param {Number} [threshold] The threshold. If omitted, it is set to 5% from the `value`.
         *  
         * @return {Object} A placeholder object
         */
        anyNumberApprox : function (value, threshold) {
            return new Siesta.Test.BDD.NumberPlaceholder({
                value               : value,
                threshold           : threshold
            })
        },
        
        
        scheduleSpecsLaunch : function () {
            if (this.launchTimeout) return
            
            var async                   = this.beginAsync()
            var originalSetTimeout      = this.originalSetTimeout
            var me                      = this
            
            this.launchTimeout          = originalSetTimeout(function () {
                me.endAsync(async)
                me.launchTimeout        = null
                
                me.launchSpecs()
            }, 0)
        },
        
        
        launchSpecs : function () {
            var me                  = this
            var sequentialSubTests  = this.sequentialSubTests
            
            this.sequentialSubTests = []
            
            // hackish way to pass a config to `t.chain`
            this.chain.actionDelay  = 0
            
            var exclusiveSubTests   = []
            
            Joose.A.each(sequentialSubTests, function (subTest) {
                if (subTest.isExclusive) exclusiveSubTests.push(subTest)
            })
            
            this.chain(exclusiveSubTests.length ? exclusiveSubTests : sequentialSubTests)
        }
    },
    
    
    override : {
        afterLaunch : function () {
            this.codeProcessed      = true
            
            this.launchSpecs()
            
            this.SUPERARG(arguments)
        }
    }
        
})
//eof Siesta.Test.BDD
