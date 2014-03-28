StartTest(function(t) {
    t.expectGlobal('Cat');

    window.Cat                  = function() {};
    
    Cat.prototype.makeFurBall   = function() {
        if (!(this instanceof Cat)) t.fail("Wrong scope of method")
    };
    
    Cat.prototype.purr          = function() {
        if (!(this instanceof Cat)) t.fail("Wrong scope of method")
    };

    t.expectPass(function(t) {
        t.methodIsCalledNTimes('makeFurBall', Cat, 1, 'purr called');
        t.methodIsCalledNTimes(Cat.prototype.purr, Cat, 1, 'purr fn called');

        new Cat().makeFurBall();
        new Cat().purr();
    })

    t.expectPass(function(t) {
        t.methodIsntCalled('purr', "Cat", 'pass: purr not called');
    })

    t.expectFail(function(t) {
        t.methodIsntCalled('purr', "Cat", 'fail: purr not called');
        new Cat().purr();
    })

    t.expectFail(function(t) {
        t.methodIsCalledNTimes('purr', Cat, 1, 'purr not called');
        t.methodIsCalledNTimes('purr', "Cat", 1, 'purr not called');
        
        t.methodIsCalledNTimes('makeFurBall', "Cat", 1, 'makeFurBall is called 2 times');
        
        new Cat().makeFurBall();
        new Cat().makeFurBall();
    });
})