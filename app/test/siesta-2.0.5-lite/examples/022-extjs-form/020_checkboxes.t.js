StartTest(function (t) {
    var fp = Ext.create('Ext.FormPanel', {
        title: 'Check/Radio Groups Example',
        frame: true,
        fieldDefaults: {
            labelWidth: 110
        },
        width: 700,
        height: 300,
        renderTo:Ext.getBody(),
        bodyPadding: 10,
        items: [{
            xtype: 'fieldset',
            title: 'Checkbox Groups (initially collapsed)',
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                labelStyle: 'padding-left:4px;'
            },
            items: [{
                xtype: 'checkboxgroup',
                fieldLabel: 'Favorite browser',
                // Put all controls in a single column with width 100%
                columns: 1,
                items: [
                    {id : 'cb-chrome', boxLabel: 'Chrome', name: 'cb-col-1'},
                    {id : 'cb-ff', boxLabel: 'Firefox', name: 'cb-col-2'},
                    {id : 'cb-safari', boxLabel: 'Safari', name: 'cb-col-3'}
                ]
            },{
                xtype: 'checkboxgroup',
                fieldLabel: 'Random questions',
                allowBlank: false,
                msgTarget: 'side',
                autoFitErrors: false,
                anchor: '-18',
                layout: 'column',
                defaultType: 'container',
                items: [{
                    columnWidth: .33,
                    items: [
                        {xtype: 'component', html: 'IE 6 is:', cls:'x-form-check-group-label'},
                        {xtype: 'checkboxfield', boxLabel: 'Awesome', name: 'cb-cust-1'},
                        {xtype: 'checkboxfield', boxLabel: 'Not so awesome', name: 'ie6-not-awesome'}
                    ]
                },{
                    columnWidth: .33,
                    items: [
                        {xtype: 'component', html: 'Chrome is', cls:'x-form-check-group-label'},
                        {xtype: 'checkboxfield', boxLabel: 'Fast', name: 'cb-cust-3'},
                        {xtype: 'checkboxfield', boxLabel: 'Not so fast', name: 'cb-cust-3'}
                    ]
                },{
                    columnWidth: .34,
                    items: [
                        {xtype: 'component', html: 'This demo is powered by', cls:'x-form-check-group-label'},
                        {xtype: 'checkboxfield', boxLabel: 'ActiveX', name: 'cb-cust-4'},
                        {xtype: 'checkboxfield', boxLabel: 'Ext JS', name: 'cb-cust-5'}
                    ]
                }]
            }]
        }]
    });
    
    // Making use of Ext.ComponentQuery
    t.chain(
        { action : 'click', target : '>>[id="cb-chrome"]' },
        { action : 'click', target : '>>[name="ie6-not-awesome]' },
        { action : 'click', target : '>>[boxLabel="Fast"]' },
        { action : 'click', target : '>>[boxLabel="Ext JS"]' },
        
        function() {
            t.pass('All boxes could be clicked ok');
        }    
    );
});