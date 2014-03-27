StartTest(function(t) {
    
    t.it('`hostPageUrl` config should prevent the inheritance of the `preload`', function (t) {
        var harness     = t.getHarness({
            preload     : [ 'preload1' ]
        }, [], true)
        
        harness.normalizeDescriptors([
            'sanity1',
            {
                group           : 'SanityGroup1',
                preload         : [ 'grouppreload1' ],
                
                items           : [
                    'sanity2'
                ]
            },
            {
                url             : 'test1',
                hostPageUrl     : 'url'
            },
            {
                url             : 'test10',
                hostPageUrl     : 'url',
                preload         : [ 'forcedPreload' ]
            },
            {
                group           : 'Group1',
                hostPageUrl     : 'url',
                
                items           : [
                    'test2'
                ]
            },
            {
                group           : 'Group2',
                hostPageUrl     : 'url',
                
                items           : [
                    {
                        preload         : 'inherit',
                        url             : 'test3'
                    }
                ]
            },
            {
                group           : 'Group3',
                hostPageUrl     : 'url',
                preload         : 'inherit',
                
                items           : [
                    {
                        url             : 'test4'
                    }
                ]
            }
        ])
        
        t.isDeeply(
            harness.getDescriptorConfig(harness.getScriptDescriptor('sanity1'), 'preload'), 
            [ 'preload1' ], 
            "Regular test should inherit preload from harness"
        )
        
        t.isDeeply(
            harness.getDescriptorConfig(harness.getScriptDescriptor('sanity2'), 'preload'), 
            [ 'grouppreload1' ], 
            "Regular test should inherit preload from group"
        )
        
        
        t.isDeeply(
            harness.getDescriptorConfig(harness.getScriptDescriptor('test1'), 'preload'), 
            [], 
            "Test1 should not inherit the preloads, since it has the `hostPageUrl`"
        )
    
        t.isDeeply(
            harness.getDescriptorConfig(harness.getScriptDescriptor('test10'), 'preload'), 
            [ 'forcedPreload' ], 
            "Test10 should use own preloads, regardless of `hostPageUrl`"
        )
        
        t.isDeeply(
            harness.getDescriptorConfig(harness.getScriptDescriptor('test2'), 'preload'), 
            [], 
            "Test1 should not inherit the preloads, since group it is in has the `hostPageUrl`"
        )
        
        t.isDeeply(
            harness.getDescriptorConfig(harness.getScriptDescriptor('test3'), 'preload'), 
            [ 'preload1' ], 
            "Test1 should now inherit the preloads since it has `preload : inherit`"
        )
        
        t.isDeeply(
            harness.getDescriptorConfig(harness.getScriptDescriptor('test4'), 'preload'), 
            [ 'preload1' ], 
            "Test1 should now inherit the preloads, since group it is in has the `preload : inherit`"
        )
    })

    
    t.it('`hostPageUrl` defined on the harness and combined with `preload` should not stop inheritance`', function (t) {
        var harness     = t.getHarness({
            hostPageUrl     : 'url',
            preload         : [ 'preload2' ]
        }, [], true)
        
        harness.normalizeDescriptors([
            {
                url             : 'test5'
            }
        ])
        
        t.isDeeply(
            harness.getDescriptorConfig(harness.getScriptDescriptor('test5'), 'preload'), 
            [ 'preload2' ], 
            "Test1 should now inherit the preloads, since `hostPageUrl` defined on harness does not stop the inheriting"
        )
    })
    
    
    t.it('`preload` defined in the test config (in the test file itself) should be taken into account`', function (t) {
        var harness     = t.getHarness({
        }, [], true)
        
        harness.normalizeDescriptors([
            {
                url             : 'test5',
                testConfig      : {
                    preload     : [ 'preload5' ]
                }
            }
        ])
        
        t.isDeeply(
            harness.getDescriptorConfig(harness.getScriptDescriptor('test5'), 'preload'), 
            [ 'preload5' ], 
            "Test5 should get the preloads from `testConfig` (which is defined from the test file content)"
        )
    })
    
    
})    