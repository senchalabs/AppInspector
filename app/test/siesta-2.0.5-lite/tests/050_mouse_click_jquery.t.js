StartTest(function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Siesta.Test keyboard simulation");

    t.testJQuery(function (t) {
        // testing click
        $(document.body).append('<div id="click">testing click</div>');
        
        var fired       = {
            mousedown       : 0,
            mouseup         : 0,
            dblclick        : 0,
            click           : 0
        }
        
        $('#click').mousedown(function () { fired.mousedown++ })
        $('#click').mouseup(function () { fired.mouseup++ })
        $('#click').click(function () { fired.click++ })
        $('#click').dblclick(function () { fired.dblclick++ })
        
        t.click($('#click'));
        
        t.isDeeply(fired, {
            mousedown       : 1,
            mouseup         : 1,
            dblclick        : 0,
            click           : 1
        }, 'Correct events has been fired')
        
        
        // testing double click
        $(document.body).append('<div id="dblclick">testing double click</div>');
        
        var fired       = {
            mousedown       : 0,
            mouseup         : 0,
            dblclick        : 0,
            click           : 0
        }
        
        $('#dblclick').mousedown(function () { fired.mousedown++ })
        $('#dblclick').mouseup(function () { fired.mouseup++ })
        $('#dblclick').click(function () { fired.click++ })
        $('#dblclick').dblclick(function () { fired.dblclick++ })

        t.doubleClick($('#dblclick'));
        
        t.isDeeply(fired, {
            mousedown       : 2,
            mouseup         : 2,
            dblclick        : 1,
            click           : 2
        }, 'Correct events has been fired')

        t.done();
    });
});

