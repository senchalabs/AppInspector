StartTest(function(t) {
    
    t.diag("Selecting the combobox item");

    // The data store containing the list of states
    var states = Ext.create('Ext.data.Store', {
        fields  : ['abbr', 'name'],
        data    : [
            {"abbr":"AL", "name":"Alabama"},
            {"abbr":"AK", "name":"Alaska"},
            {"abbr":"AZ", "name":"Arizona"}
        ]
    });
    
    var selected    = false
    
    // Create the combo box, attached to the states data store
    var combo = Ext.create('Ext.form.ComboBox', {
        fieldLabel      : 'Choose State',
        store           : states,
        queryMode       : 'local',
        displayField    : 'name',
        valueField      : 'abbr',
        renderTo        : Ext.getBody(),
        editable        : false,
        listeners       : {
            select  : function (combo, records) {
                selected = true
                
                Ext.Msg.alert('Item selected', 'Selected: ' + records[ 0 ].get('name'))
            }
        }
    });
    
    t.chain(
        {
            click       : combo.el.query('.x-trigger-cell')[ 0 ],
            desc        : 'Successfully clicked'
        },
        function (next) {
            t.click(combo.getPicker().getNode(2), next)
        },
        function () {
            t.ok(selected, 'Item was selected')
        }
    )
});