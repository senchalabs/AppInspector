StartTest(function (t) {

    var store = new Ext.data.ArrayStore({
        fields : ['text'],
        data   : [
            ['form'],
            ['grid']
        ]
    });

    var combo = new Ext.form.ComboBox({
        fieldLabel : 'Combo',

        displayField : 'text',
        valueField   : 'text',

        allowBlank     : true,
        editable       : true,
        selectOnFocus  : true,
        forceSelection : true,  // TODO, with this false, test fails - needs investigation
        queryMode      : 'local',
        triggerAction  : 'all',
        typeAhead      : true,

        store    : store,
        renderTo : Ext.getBody()
    });

    var cmp2 = new Ext.form.TextField({
        fieldLabel : 'Foo',
        renderTo   : Ext.getBody()
    });

    t.chain(
        { type : 'gri', target : combo },

        { waitFor : 100 },

        { type : '[TAB]' },
        
//        See this piece of code in Ext.form.field.Text (fixed in 4.2.2)
//        
//            // see: http://code.google.com/p/chromium/issues/detail?id=4505
//            if (Ext.isWebKit) {
//                if (!me.inputFocusTask) {
//                    me.inputFocusTask = new Ext.util.DelayedTask(me.focusInput, me);
//                }
//                me.inputFocusTask.delay(1);
//            } else {
//        ...
//        
//        the previous [TAB] simulation correctly triggers the focus change, but 
//        this code causes the deferred "select" call, which focuses the combo box field again
//        so we just type TAB again
        Ext.isWebKit && Ext.getVersion('extjs').isLessThan('4.2.2.1144') ? { type : '[TAB]' } : null,


        function (next) {
            t.is(combo.getValue(), 'grid');
            t.is(document.activeElement, cmp2.inputEl.dom, 'Text field focused');
            t.notOk(combo.getPicker().isVisible(), 'Combo list not visible');

            next();
        },

        { type : '[TAB]' },

        function (next) {
            t.is(combo.getValue(), 'grid');
            t.is(document.activeElement, document.body, 'No field focused');
        }
    )
});

