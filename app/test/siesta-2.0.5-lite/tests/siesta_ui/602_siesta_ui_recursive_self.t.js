StartTest(function (t) {
    t.getHarness({
        testClass   : Class({
        
            isa     : Siesta.Test.ExtJS,
        
            does    : Siesta.Test.Self
        })
    },[
    {
            group               : 'Siesta UI',
            items               : [
                {
                    hostPageUrl : '601_siesta_ui.html?diff=' + (new Date() - 0),
                    url : '602_siesta_ui_recursive_self.t.js'
                }
            ]
        }
    ]);
    
    t.waitForRowsVisible('testgrid', function () {
        t.diag('Test grid loaded ok');
        t.pass('This was fun, I think I want to do it again!');
    });
});