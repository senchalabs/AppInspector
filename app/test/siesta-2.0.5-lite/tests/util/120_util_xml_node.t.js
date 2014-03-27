StartTest(function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Sanity")
    
    t.ok(Siesta.Util.XMLNode, 'Siesta.Util.XMLNode is here')
    
    
    var root        = new Siesta.Util.XMLNode({
        tag         : 'testsuites',
        
        attributes  : { foo : 'bar', quix : 'blarg' },
        
        textContent : "En taro Adun!"    
    })

    var child = root.appendChild({
        tag         : 'testsuite',
        
        attributes  : { equi : 'nox' }
    })

    child.appendChild({
        tag         : 'testcase',
        
        textContent : 'yo'
    })
    
    t.is(root + '', '<testsuites foo="bar" quix="blarg">En taro Adun!<testsuite equi="nox"><testcase>yo</testcase></testsuite></testsuites>', 'Correct XML stringification')
})