describe("myName", function (topTest) {
    
    topTest.testGeneric(
        {
            doNotTranslate : true
        }, 
        function (t) {
            t.it("1", function (t) {
                topTest.fail("This `it` section should be ignored")
            })
            
            t.iit("3", function (t) {
                t.pass("4")
                
                t.waitFor(100, function () {
                    
                    t.iit("5", function (t) {
                        t.pass("6")
                        
                        t.waitFor(100, function () {})
                    })
                    
                    t.it("7", function (t) {
                        topTest.fail("This `it` section should be ignored")
                    })
                })
            })
            
            t.ddescribe("9", function (t) {
                t.it("10", function (t) {
                    topTest.fail("This `it` section should be ignored")
                })
                t.it("11", function (t) {
                    topTest.fail("This `it` section should be ignored")
                })
                t.iit("12", function (t) {
                    t.pass("13")
                    
                    t.waitFor(100, function () {})
                })
            })
        }, 
        function (test) {
            topTest.ok(test.isPassed(), 'Test passes')
            
            topTest.isDeeply(
                topTest.getDescriptionTree(test), 
                [
                    {
                        desc        : 3,
                        children    : [
                            {
                                desc    : 4
                            },
                            {
                                desc    : 'Waited 100 ms'
                            },
                            {
                                desc        : 5,
                                children    : [
                                    {
                                        desc    : 6
                                    },
                                    {
                                        desc    : 'Waited 100 ms'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        desc        : 9,
                        children    : [
                            {
                                desc        : 12,
                                children    : [
                                    {
                                        desc    : 13
                                    },
                                    {
                                        desc    : 'Waited 100 ms'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            )
            // eof isDeeply
        }
        // eof callback
    )    
    // eof testGeneric
    
})    
