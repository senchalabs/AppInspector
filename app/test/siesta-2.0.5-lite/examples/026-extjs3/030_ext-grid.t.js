StartTest(function(t) {
    
     var myData = [
        ['3m Co',                               71.72, 0.02,  0.03,  '9/1 12:00am'],
        ['Alcoa Inc',                           29.01, 0.42,  1.47,  '9/1 12:00am'],
        ['Altria Group Inc',                    83.81, 0.28,  0.34,  '9/1 12:00am'],
        ['American Express Company',            52.55, 0.01,  0.02,  '9/1 12:00am'],
        ['American International Group, Inc.',  64.13, 0.31,  0.49,  '9/1 12:00am'],
        ['AT&T Inc.',                           31.61, -0.48, -1.54, '9/1 12:00am'],
        ['Wal-Mart Stores, Inc.',               45.45, 0.73,  1.63,  '9/1 12:00am']
    ];

    // create the data store
    var store = new Ext.data.ArrayStore({
        fields: [
           {name: 'company'},
           {name: 'price',      type: 'float'},
           {name: 'change',     type: 'float'},
           {name: 'pctChange',  type: 'float'},
           {name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
        ]
    });

    // manually load local data
    store.loadData(myData);

    // create the Grid
    var grid = new Ext.grid.GridPanel({
        store: store,
        columns: [
            {
                id       :'company',
                header   : 'Company', 
                width    : 160, 
                sortable : true, 
                dataIndex: 'company'
            },
            {
                header   : 'Price', 
                width    : 75, 
                sortable : true, 
                renderer : 'usMoney', 
                dataIndex: 'price'
            },
            {
                header   : 'Change', 
                width    : 75, 
                sortable : true, 
                dataIndex: 'change'
            },
            {
                header   : '% Change', 
                width    : 75, 
                sortable : true, 
                dataIndex: 'pctChange'
            }
        ],
        autoExpandColumn: 'company',
        height: 350,
        width: 600
    });

    // render the grid to the specified div in the page
    grid.render(Ext.getBody());

    t.waitForRowsVisible(grid, function() {
        
    });

    var steps = [
        // First wait until rows are present in the DOM
        { waitFor : 'rowsVisible', args : grid },

        { action : 'click', target : function() { return grid.el.child('.x-grid3-row'); } },
        { action : 'click', target : function() { return grid.el.child('.x-grid3-row:nth-child(2)'); } },
        { action : 'click', target : function() { return grid.el.child('.x-grid3-row:nth-child(3)'); } },
        { action : 'click', target : function() { return grid.el.child('.x-grid3-row:nth-child(4)'); } }
    ];

    t.chain(steps);
});