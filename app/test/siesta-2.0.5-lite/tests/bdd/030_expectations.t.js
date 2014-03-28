describe("myName", function (t) {
    
    t.testGeneric(
        {
            doNotTranslate : false
        }, 
        function (t) {
            t.expect(1).toBe(1)
            t.expect(1).not.toBe(2)
            
            t.expect([]).toEqual([])
            t.expect([]).not.toEqual({})
            
            t.expect([]).not.toBeNull()
            t.expect(null).toBeNull()
            
            t.expect(NaN).toBeNaN()
            
            t.expect(function () {}).toBeDefined()
            t.expect(1).toBeDefined()
            t.expect(undefined).toBeUndefined()
            
            t.expect("asd").toMatch(/asd/)
            
            t.expect([ 1 ]).toContain(1)
            
            t.expect([ 2 ]).not.toContain(1)
            
            t.expect("asd").toContain("a")
            t.expect("asd").not.toContain("z")
            
            t.expect(1).toBeCloseTo(1.01, 1)
            t.expect(1).not.toBeCloseTo(2)
    
            t.expect(function () {
                throw 1;
            }).toThrow()
            
            t.expect(function () {
            }).not.toThrow()
            
            t.expect(1).toBe(t.any(Number))
            t.expect(function () {}).toBe(t.any(Function))
            t.expect(function () {}).toBe(t.any(Object))
        }, 
        function (test) {
        }
    )    
    
})    
