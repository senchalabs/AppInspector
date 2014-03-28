StartTest(function(t) {
    //==================================================
    t.diag('Writing test first, but not all edge cases needs to be covered from start')

    var summator = function (a, b) { return a + b }
    
    t.is(summator(1, 1), 2, 'Correct sum for 1 + 1')
    t.is(summator(1, 10), 11, 'Correct sum for 1 + 10')
    
    t.todo('Need handle incorrect types', function (todo) {
        // instead of `todo` here, you can use `t` - then later you can 
        // just remove the wrapping `t.todo` function 
        
        todo.throwsOk(function () {
            summator([], {})
        }, 'Error', 'Throws exception for incorrect types')

        // a special-case - need to auto-cast strings to numbers
        todo.is(summator("1.1", "2.1"), 2.3, 'Correct auto-casting strings to number #1')
        todo.is(summator("1.1", 2.1), 2.3, 'Correct auto-casting strings to number #2')
        todo.is(summator(1.1, "2.1"), 2.3, 'Correct auto-casting strings to number #3')
        
        // sometimes they actually start to pass
        todo.is(summator(0, 1), 1, 'Sometimes they actually start to pass')
    })
});