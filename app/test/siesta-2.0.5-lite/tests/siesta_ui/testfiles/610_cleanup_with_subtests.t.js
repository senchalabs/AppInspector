describe("myName", function (t) {
    t.it("1", function (t) {
        t.pass("2")
        
        t.waitFor(100, function () {})
    })
    
    t.it("3", function (t) {
        
        t.pass("4")
        
        t.waitFor(100, function () {
            
            t.it("5", function (t) {
                
                t.pass("6")
                
                t.waitFor(100, function () {
                
                })
            })
            
            t.it("7", function (t) {
                
                t.pass("8")
                
                t.waitFor(100, function () {
                
                })
            })
            
        })
    })
    
    t.describe("9", function (t) {
        
        t.it("10", function (t) {
            
            t.pass("11")
            
            t.waitFor(100, function () {})
        })
    })
})    
