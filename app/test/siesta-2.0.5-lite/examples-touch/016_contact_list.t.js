StartTest(function (t) {
    t.diag('Testing a contact list');

    Ext.define('Contact', {
        extend: 'Ext.data.Model',
        config: {
            fields: ['firstName', 'lastName']
        }
    });

    var store = Ext.create('Ext.data.Store', {
        model: 'Contact',
        sorters: 'lastName',

        grouper: {
            groupFn: function (record) {
                return record.get('lastName')[0];
            }
        },

        data: [
            { firstName: 'Tommy', lastName: 'Maintz' },
            { firstName: 'Rob', lastName: 'Dougan' },
            { firstName: 'Ed', lastName: 'Spencer' },
            { firstName: 'Jamie', lastName: 'Avins' },
            { firstName: 'Aaron', lastName: 'Conran' },
            { firstName: 'Dave', lastName: 'Kaneda' },
            { firstName: 'Jacky', lastName: 'Nguyen' },
            { firstName: 'Abraham', lastName: 'Elias' },
            { firstName: 'Jay', lastName: 'Robinson' },
            { firstName: 'Nigel', lastName: 'White' },
            { firstName: 'Don', lastName: 'Griffin' },
            { firstName: 'Nico', lastName: 'Ferrero' },
            { firstName: 'Nicolas', lastName: 'Belmonte' },
            { firstName: 'Jason', lastName: 'Johnston' }
        ]
    });

    var list = Ext.create('Ext.List', {
        fullscreen      : true,
        itemTpl         : '<div class="contact">{firstName} <strong>{lastName}</strong></div>',
        store           : store,
        grouped         : true
    });

    t.chain(
        function(next) {
            t.scrollUntilElementVisible(list.element, 'down', '.x-list-item-last .contact', next);
        },

        function(next) {
            t.pass('Scrolled last item into view');
            next();
        },

        { action : 'tap', target : '.x-list-item-last .contact' },

        function(next) {
            var sel = list.getSelection();
            t.is(sel.length, 1, '1 item is selected');
            t.is(sel[0].get('firstName'), 'Nigel', 'The might Sir Animal is selected');

            // Let's go back up
            t.scrollUntilElementVisible(list.element, 'up', list.element.down('.x-list-item-first .contact'), next);
        }
    );
});
