StartTest(function(t) {
    t.chain(
        { action : 'moveCursorTo', target : [10, 10] },

        function(next) {
            t.diag('Moved to 10, 10');
            next();
        },

        { waitFor : 1000 },

        { action : 'moveCursorTo', target : [100, 20] },

        function(next) {
            t.diag('Moved to 100, 20');

            next();
        }
    )
});