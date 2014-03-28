StartTest(function(t) {
    
    var event     = new My.Model.Event({
        StartDate       : new Date(2013, 1, 1),
        EndDate         : new Date(2013, 1, 10),
        Type            : 'meeting'
    })
    
    t.is(event.getEndDate(), new Date(2013, 1, 10), "Correct end date returned")
    t.is(event.getType(), 'meeting', 'Correct type set')
})    
