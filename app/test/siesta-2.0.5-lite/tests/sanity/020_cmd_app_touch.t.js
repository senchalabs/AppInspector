StartTest(function (t) {
    // touch microloader creates some iframe, which will be stored under "0"
    t.expectGlobal('TestApp', '0')
    
    t.chain(
        { waitFor : 'ComponentQueryVisible', args : 'main' },
        { click : '.x-tab-icon:nth-child(2)' },
        { 
            waitFor : function (next) {
                return t.cq1('main').getActiveItem() == t.cq1('main').getInnerItems()[ 1 ]
            },
            desc    : 'Tab has switched'
        }
    )
    
})    