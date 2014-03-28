describe("myName", function (t) {
    
    t.testGeneric(
        {
            doNotTranslate : true
        }, 
        function (t) {
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
        }, 
        function (test) {
            t.ok(test.isPassed(), 'Test passes')
            
            t.is(test.getPassCount(true), 10, "There's 10 passing assertions in all sub-tests (5 pass and 5 waitFor)")
            t.is(test.getFailCount(true), 0, "There's 0 failing assertions in all sub-tests")
            
            t.isDeeply(
                t.getDescriptionTree(test), 
                [
                    {
                        desc        : 1,
                        children    : [
                            {
                                desc    : 2
                            },
                            {
                                desc    : 'Waited 100 ms'
                            }
                        ]
                    },
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
                            },
                            {
                                desc        : 7,
                                children    : [
                                    {
                                        desc    : 8
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
                                desc        : 10,
                                children    : [
                                    {
                                        desc    : 11
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
            
            var subTests    = []
            var isFirst     = true
            
            test.eachSubTest(function (subTest) {
                if (isFirst) {
                    subTests.push(subTest)
                    isFirst     = false
                } else
                    subTests.push(subTest.name)
            })
            
            t.isDeeply(subTests, [ test, 1, 3, 5, 7, 9, 10 ], "`eachSubTest` works ok")
        }
        // eof callback
    )    
    // eof testGeneric
    
})    
