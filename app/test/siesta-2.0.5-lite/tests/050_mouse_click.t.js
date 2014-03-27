StartTest(function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Siesta mouse click simulation");
    
    t.testExtJS(function (t) {
        // Verify check box click works
        document.body.innerHTML = '<input type="checkbox" />';
        t.click('input');
        t.selectorExists('input:checked', 'Checkbox should be checked after clicking it');


        // plain simple clicks
        var clickDiv = Ext.getBody().createChild({
            tag     : 'div',
            html    : 'testing click'
        });
        t.willFireNTimes(clickDiv, 'mousedown', 1,  'left click is ok #1');
        t.willFireNTimes(clickDiv, 'mouseup', 1,  'left click is ok #2');
        t.willFireNTimes(clickDiv, 'click', 1,  'left click is ok #3');
        
        // plain simple clicks
        var rightClickDiv = Ext.getBody().createChild({
            tag     : 'div',
            html    : 'testing right click'
        });
        t.willFireNTimes(rightClickDiv, 'mousedown', 1,  'right click is ok #1');
        t.willFireNTimes(rightClickDiv, 'mouseup', 1,  'right click is ok #2');
        t.willFireNTimes(rightClickDiv, 'contextmenu', 1,  'right click is ok #3');
        
        // plain simple clicks
        var doubleClickDiv = Ext.getBody().createChild({
            tag     : 'div',
            html    : 'testing double click'
        });
        t.willFireNTimes(doubleClickDiv, 'mousedown', 2,  'double click is ok #1');
        t.willFireNTimes(doubleClickDiv, 'mouseup', 2,  'double click is ok #2');
        t.willFireNTimes(doubleClickDiv, 'click', 2,  'double click is ok #3');
        t.willFireNTimes(doubleClickDiv, 'dblclick', 1,  'double click is ok #4');
        
        // now clicking in the center of the outer (bigger) div
        // but the click should happen on the top-most element at that position in the DOM
        var div2 = Ext.getBody().createChild({
            tag     : 'div',
            style   : 'width : 100px; height : 100px; background: blue',
            
            children    : {
                tag     : 'div',
                style   : 'width : 50px; height : 50px; background: yellow; position : relative; top : 25px; left : 25px',
                html    : '&nbsp'
            }
        });
        
        var innerDiv    = div2.child('div')
        
        t.willFireNTimes(innerDiv, 'mousedown', 1,  'top click is ok #1');
        t.willFireNTimes(innerDiv, 'mouseup', 1,  'top click is ok #2');
        t.willFireNTimes(innerDiv, 'click', 1,  'top click is ok #3');
        
        t.chain(
            {
                action      : 'click',
                target      : clickDiv
            },
            {
                action      : 'rightClick',
                target      : rightClickDiv
            },
            {
                action      : 'doubleclick',
                target      : doubleClickDiv
            },
            {
                action      : 'click',
                target      : div2
            }
        )
    });
});

