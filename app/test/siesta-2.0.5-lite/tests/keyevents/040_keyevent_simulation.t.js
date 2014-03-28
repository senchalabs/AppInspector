StartTest({ speedRun : false }, function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Siesta.Test keyboard simulation");
    
    var keys = " ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
        box = new Ext.form.TextField({
            width : 400,
            enableKeyEvents : true,
            renderTo : Ext.getBody()
        }),
        numberField = new Ext.form.NumberField({
            width : 100,
            enableKeyEvents : true,
            renderTo : Ext.getBody(),
            value : 0
        }),
        datePicker = new Ext.picker.Date({
            renderTo : Ext.getBody(),
            value : new Date(2011, 9, 5)
        }),
        rawLink = Ext.getBody().createChild({
            tag : 'a',
            html : 'testing link',
            href : '#',
            tabIndex : 1
        });
    rawLink.on('click', function(e, t) { 
        e.stopEvent(); 
    });

    function getDateCellFocusEl() { return datePicker.el.down('.' + datePicker.selectedCls + ' a'); }
        
    t.testExtJS({ 
        // The date picker needs a few ms to alter focus to the each new date cell
        actionDelay : 100 
    }, function (t) {
        
        var nbrKeys = keys.length;

        
        t.willFireNTimes(box, 'keydown', nbrKeys)
        t.willFireNTimes(box, 'keyup', nbrKeys)
        t.willFireNTimes(box, 'keypress', nbrKeys)
        
        t.willFireNTimes(numberField, 'specialkey', 4, 'NumberField specialkey');
        t.willFireNTimes(datePicker, 'select', 2, 'DatePicker select');

        t.willFireNTimes(rawLink, 'click', 2,  'Anchor tag');
       
        t.chain(
            { action : 'click', target : rawLink },

            { action : 'type', target : rawLink, text : '[ENTER]' },
            
            { action : 'type', target : box, text : keys },
            
            { action : 'click', target : numberField },

            { action : 'type', target : numberField, text : "[UP][UP][DOWN][UP]" }, 
            
            { action : 'click', target : '.' + datePicker.selectedCls + ' a' },
            
            // Two steps to the right, then Enter to select
            { action : 'type', text : '[RIGHT][RIGHT][LEFT][RIGHT][ENTER]' },
            
            function() {
                t.fieldHasValue(box, keys, "Correctly simulated normal character keys");
                
                t.fieldHasValue(numberField, 2, "Correctly simulated up/down arrow keys");
                
                t.fieldHasValue(datePicker, new Date(2011, 9, 7), "Correctly simulated LEFT/RIGHT/ENTER arrow keys");
            }
        );
    });
});
