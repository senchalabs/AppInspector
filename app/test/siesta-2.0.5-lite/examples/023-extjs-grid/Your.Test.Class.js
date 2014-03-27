Class('Your.Test.Class', {

    isa     : Siesta.Test.ExtJS,
    
    has     : {
        // will be initialized with atomic values
        attribute1    : null,
        attribute2    : 'foo',
        attribute3    : 11,
        
        attribute4    : {
            // will be initialized { foo : 'bar' } object
            init    : {
                foo     : 'bar'
            }
        },
        
        // will be initialized with empty array
        attribute5    : Joose.I.Array,
        
        // will be initialized with empty object
        attribute6    : Joose.I.Object
    },
    
    
    methods: {
        getGrid : function(config){
            // Change to correct Ext scope
            var Ext = this.global.Ext;
            
            Ext.define('Gamer', {
                extend : 'Ext.data.Model',
                fields: [
                   {name: 'name'},
                   {name: 'highscore', type: 'int'},
                   {name: 'place', type: 'int'},
                   {name: 'lastgame', type: 'date', dateFormat: 'Y-m-d'}
                ]
            });
            var store = Ext.create('Ext.data.ArrayStore', {
                model : 'Gamer',
                data: [
                    ['Mike', 10, 20, '2010-12-12'],
                    ['Swedish Chef', 10, 20, '2010-01-12'],
                    ['Jay', 10, 20, '2010-06-12'],
                    ['Brian', 10, 20, '2010-04-12'],
                    ['Geoff', 10, 20, '2010-08-12']
                ]
            });

            // create and return the grid
            return Ext.create('Ext.grid.Panel', Ext.apply({
                store: store,
                columnLines : true,
                columns: [
                    {
                        text     : 'Name',
                        flex     : 1,
                        sortable : false,
                        dataIndex: 'name', 
                        field : {}
                    },
                    {
                        text     : 'Highscore',
                        width    : 75,
                        sortable : true,
                        dataIndex: 'highscore', 
                        field : { xtype : 'numberfield' }
                    },
                    {
                        text     : 'Rank',
                        width    : 75,
                        sortable : true,
                        dataIndex: 'place'
                    },
                    {
                        text     : 'Last game',
                        width    : 85,
                        sortable : true,
                        renderer : Ext.util.Format.dateRenderer('Y/m/d'),
                        dataIndex: 'lastgame', 
                        field : { xtype : 'datefield' }
                    }
                ],
                height: 150,
                width: 400,
                title: 'Some Grid'
            }, config));
        }
    }
});