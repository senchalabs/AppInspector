StartTest(function (t) {
    
    document.body.innerHTML = '<input type="checkbox" />';
    
    t.click('input');
    
    t.selectorExists(':checked', 'Checkbox should be checked after clicking it');

    var cb = new Ext.form.Checkbox({
        xtype: 'checkbox',
        fieldLabel: 'Label',
        boxLabel: 'Search Both',
        anchor: '100%'
    });

    var simple = new Ext.form.FormPanel({
        layout: 'form',
        renderTo : Ext.getBody(),
        width: 150,
        items: cb
    });

    t.click('.x-form-checkbox', function() {
        t.ok(cb.getValue(), 'Ext Form checkbox should be checked after clicking it');
    });
});
