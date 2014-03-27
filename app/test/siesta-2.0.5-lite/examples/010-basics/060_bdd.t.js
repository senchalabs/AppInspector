describe("My test suite", function (t) {
    t.diag('Using BDD style syntax, as seen in Jasmine and other test frameworks')
    
    t.describe("Assertions", function (t) {
        
        t.it("Expectations should work", function (t) {
            t.expect(1).toBe(1)
            t.expect(1).not.toBe(2)
            
            t.expect([]).toEqual([])
            t.expect([]).not.toEqual({})
            
            t.expect([]).not.toBeNull()
            t.expect(null).toBeNull()
            
            t.expect(NaN).toBeNaN()
            
            t.expect(1).toBeDefined()
            t.expect(undefined).toBeUndefined()
            
            t.expect("Foo").toMatch(/foo/i)
            t.expect("Bar").not.toMatch(/foo/i)
            
            t.expect([ 1 ]).toContain(1)
            t.expect([ 1 ]).not.toContain(2)
            
            t.expect("Foo").toContain("oo")
            t.expect("Bar").not.toContain("oo")
            
            t.expect(1).toBeCloseTo(1.01, 1)
    
            t.expect(function () {
                throw new Error("exception");
            }).toThrow()
            
            t.expect(function () {
            }).not.toThrow()
            
            // this is a regular Siesta method
            t.waitFor(300, function () {})
        })
    })
    
    t.it("and this should work too", function (t) {
        
        t.pass("yo")
        
        t.waitFor(300, function () {
            
            t.it("INNER: and this should work too", function (t) {
                
                t.pass("yo-INNER")
                
                t.waitFor(300, function () {
                
                })
            })
            
            t.it("INNER2: and this should work too", function (t) {
                
                t.pass("yo-INNER2")
                
                t.waitFor(300, function () {
                
                })
            })
            
        })
    })
    
    t.describe("Nested Describe", function (t) {
        
        t.it("should work nested spec ", function (t) {
            
            t.pass("yo")
            
            t.waitFor(300, function () {})
        })
    })
})    
