StartTest(function(t) {
    
    t.testGeneric(function (t) {
        var scope       = {}
        
        var obj = {
            indirect        : function () {
                t.isStrict(this, scope, "Correct scope during indirect call")
            },
            direct          : function () {
                this.indirect.call(scope)
            },
            
            fnCalled        : function() { },
            fnNotCalled     : function() { },

            fn2             : function() { },
            fn3             : function() { }
        };
    
        t.isCalled(obj.indirect, obj, 'Indirect call detected');
        t.isCalled(obj.fnCalled, obj, 'isCalled');
        t.isntCalled(obj.fnNotCalled, obj, 'isntCalled');
        t.isCalledNTimes(obj.fn2, obj, 0, 'isCalledNTimes');
        t.isCalledNTimes(obj.fn3, obj, 1, 'isCalledNTimes');

        obj.fnCalled();
        obj.fn3();
        obj.direct()
        
        t.done();
    })

    t.expectFail(function(t) {
        var obj = {
            fnCalled        : function() { },
            fnNotCalled     : function() { },
            fn2             : function() { }
        };
    
        t.isCalled(obj.fnNotCalled, obj, 'isCalled failed OK');
        t.isntCalled(obj.fnCalled, obj, 'isntCalled failed OK');
        t.isCalledNTimes(obj.fn2, obj, 2, 'isCalledNTimes failed OK');
        
        obj.fnCalled();
        
        t.done();
    });
})