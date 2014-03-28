StartTest(function (t) {
    // this test exersizes the "elementIsScrolledOut" method
    
    t.testExtJS(function (t) {
        t.it('Determine that element is scrolled out of the view', function (t) {
            document.body.innerHTML =
                '<div style="position:absolute; left:100px; border:1px solid #ddd; width:200px; height:200px; overflow:auto">' +
                    '<div style="position:absolute; background:#aaa; left:250px; width:50px; height:50px" id="inner">FOO</div>' +
                '</div>';
                
            t.ok(t.elementIsScrolledOut(document.getElementById('inner')), 'Correctly determined scrolled out element')
        });
        
        t.it('Determine that element is not scrolled out of the view', function (t) {
            document.body.innerHTML =
                '<div style="position:absolute; left:100px; border:1px solid #ddd; width:200px; height:200px; overflow:auto">' +
                    '<div style="position:absolute; background:#aaa; width:50px; height:50px" id="inner">FOO</div>' +
                '</div>';
                
            t.notOk(t.elementIsScrolledOut(document.getElementById('inner')), 'Correctly determined scrolled out element')
        });
        
        t.it('Determine that element is scrolled out of the view', function (t) {
            document.body.innerHTML =
                '<div style="position:absolute; left:100px; border:1px solid #ddd; width:200px; height:200px; overflow:auto">' +
                    '<div style="overflow:hidden; position:absolute; background:#aaa; width:50px; height:50px" id="inner">' +
                        '<div style="position:absolute; background:red; left:45px; width:10px; height:10px" id="inner2"></div>' +
                    '</div>' +
                '</div>';
                
            t.notOk(t.elementIsScrolledOut(document.getElementById('inner')))
            t.ok(t.elementIsScrolledOut(document.getElementById('inner2'), [ 9, 9 ]), "Works with offset #1")
            t.notOk(t.elementIsScrolledOut(document.getElementById('inner2'), [ 1, 1 ]), "Works with offset #2")
        });
        
        t.it('Determine that element is scrolled out of the view', function (t) {
            document.body.innerHTML =
                '<div style="position:absolute; left:100px; border:1px solid #ddd; width:200px; height:200px; overflow:auto">' +
                    '<div style="overflow:hidden; position:absolute; background:#aaa; width:50px; height:50px" id="inner">' +
                        '<div style="position:absolute; background:red; top:45px; width:10px; height:10px" id="inner2"></div>' +
                    '</div>' +
                '</div>';
                
            t.notOk(t.elementIsScrolledOut(document.getElementById('inner')))
            t.ok(t.elementIsScrolledOut(document.getElementById('inner2'), [ 9, 9 ]), "Works with offset #1")
            t.notOk(t.elementIsScrolledOut(document.getElementById('inner2'), [ 1, 1 ]), "Works with offset #2")
        });
        
    });


});

