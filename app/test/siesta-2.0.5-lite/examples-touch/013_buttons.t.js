StartTest(function(t) {
    t.diag('Testing buttons');

    Ext.Viewport.add({
        xtype: 'toolbar',
        docked: 'top',

        items: [
            { ui: 'back', text: 'Back' },
            { text: 'Default' },
            { ui: 'round', text: 'Round' },
            { ui: 'action', text: 'Action' }
        ]
    });

    // Simulate an async UI generation flow
    setTimeout(function() {
          Ext.Viewport.down('toolbar').add({ ui: 'forward', text: 'Forward' });
    }, 2000);
    
    Ext.each(Ext.ComponentQuery.query('button'), function(btn) {
        t.willFireNTimes(btn, 'tap', 1);
    });

    t.chain({
        waitFor : 'CQ', args : 'button[ui=forward]' 
    },{
        action : 'click',
        target : '>>button[ui="back"]'
    },{
        action : 'click',
        target : '>>button[text=Default]'
    }, {
        action : 'click',
        target : '>>button[ui="round"]'
    },{
        action : 'click',
        target : '>>button[ui="action"]'
    }, {
        action : 'click',
        target : '>>button[ui="forward"]'
    });
});
