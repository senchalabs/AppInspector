Ext.define('AM.view.user.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.userlist',

    title : 'All Users',
    store: 'Users',

    columns: [
        {header: 'Name',  dataIndex: 'firstname', flex: 1, renderer : function(v, m, r) {return r.getFullName(); }},
        {header: 'Email', dataIndex: 'email', flex: 1}
    ]
});

