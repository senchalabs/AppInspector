StartTest(function (t) {

    t.requireOk('Ext.ux.ajax.SimManager', function () {
        Ext.define('MyModel', {
            extend : 'Ext.data.Model',
            fields : [
                'id',
                'name',
                'age'
            ]
        });

        Ext.ux.ajax.SimManager.init({
            delay : 300
        }).register(
            {
                '/app/data/url' : {
                    stype : 'json',  // use JsonSimlet (stype is like xtype for components)
                    data  : [
                        { id : 1, name : 'user1', age : 25 },
                        { id : 2, name : 'user2', age : 35 },
                        { id : 3, name : 'user3', age : 45 }
                    ]
                }
            }
        );

        var store = new Ext.data.Store({
            model : 'MyModel',

            proxy : {
                type : 'ajax',
                url  : '/app/data/url' // doesn't exist
            }
        });

        t.willFireNTimes(store, 'load', 1);

        t.it('should be possible to load mock data', function (t) {
            t.loadStoresAndThen(store, function () {
                t.expect(store.first().get('id')).toBe(1);
                t.expect(store.first().get('name')).toBe('user1');
                t.expect(store.getAt(1).get('id')).toBe(2);
                t.expect(store.getAt(1).get('name')).toBe('user2');
                t.expect(store.getAt(2).get('id')).toBe(3);
                t.expect(store.getAt(2).get('name')).toBe('user3');
            });
        });
    });
});