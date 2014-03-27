StartTest(function(t) {
    t.diag('hasSize');
    
    document.body.innerHTML = '<div id="div" style="height:100px;width:100px">FOO</div>';
    var div = Ext.get('div');

    t.expectPass(function (t) {
        t.hasRegion(
            div,
            // Ext.Element.getXY() is not consistent for IE6/7
            Ext.isIE6 || Ext.isIE7 ? { top : 2, right : 102, bottom : 102, left : 2 } : { top : 0, right : 100, bottom : 100, left : 0 }, 
            'hasRegion OK'
        );
    });
    
    t.expectFail(function (t) {
        t.hasRegion(div, { top : 5, right : 5, bottom : 5, left : 5 }, 'hasRegion fails OK');
    });

});