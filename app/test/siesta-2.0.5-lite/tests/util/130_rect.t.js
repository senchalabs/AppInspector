StartTest(function(t) {
    
    var rect1        = new Siesta.Util.Rect({
        left        : 10,
        top         : 10,
        width       : 1,
        height      : 1
    })
    
    var rect2       = new Siesta.Util.Rect({
        left        : 100,
        top         : 100,
        right       : 109,
        bottom      : 109
    })
    
    var rect3       = new Siesta.Util.Rect({
        left        : 105,
        top         : 105,
        right       : 107,
        bottom      : 118
    })
    
    
    t.it("Should calculate missing properties", function (t) {
        t.is(rect1.right, 10)
        t.is(rect1.bottom, 10)
        
        t.is(rect2.width, 10)
        t.is(rect2.height, 10)
    })
    
    t.it("`Contains` should work", function (t) {
        t.ok(rect1.contains(10, 10), "Rect contains own px")
        t.notok(rect1.contains(11, 10), "Rect does not contain different px")
        
        t.ok(rect2.contains(105, 108))
        
        t.notOk(rect2.contains(110, 108))
    })
    
    t.it("`intersect` should work", function (t) {
        var result1         = rect1.intersect(rect2)
        var result2         = rect2.intersect(rect1)
        
        t.isaOk(result1, Siesta.Util.Rect, "Result of interesection is a new rectangle instance")
        t.isaOk(result2, Siesta.Util.Rect, "Result of interesection is a new rectangle instance")
        
        t.ok(result1.isEmpty(), "And its empty")
        t.ok(result2.isEmpty(), "And its empty")
        

        var result3         = rect2.intersect(rect3)
        var result4         = rect3.intersect(rect2)
        
        t.ok(result3.equalsTo(result4), "Both intersections have produced same results")
        
        t.is(result3.left, 105)
        t.is(result3.right, 107)
        t.is(result3.top, 105)
        t.is(result3.bottom, 109)
    })
    
    
    t.it("`cropLeftRight` should work", function (t) {
        var result1         = rect2.cropLeftRight(rect3)
        
        t.isaOk(result1, Siesta.Util.Rect, "Result of `cropLeftRight` is a new rectangle instance")
        
        t.is(result1.left, 105)
        t.is(result1.right, 107)
        t.is(result1.top, 100)
        t.is(result1.bottom, 109)
    })

    
    t.it("`cropTopBottom` should work", function (t) {
        var result1         = rect2.cropTopBottom(rect3)
        
        t.isaOk(result1, Siesta.Util.Rect, "Result of `cropTopBottom` is a new rectangle instance")
        
        t.is(result1.left, 100)
        t.is(result1.right, 109)
        t.is(result1.top, 105)
        t.is(result1.bottom, 109)
        
    })
    
})