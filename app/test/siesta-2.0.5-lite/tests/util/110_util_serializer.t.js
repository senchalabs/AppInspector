StartTest(function(t) {
    
    //==================================================================================================================================================================================
    t.diag("Sanity")
    
    t.ok(Siesta.Util.Serializer, 'Siesta.Util.Serializer is here')

    //==================================================================================================================================================================================
    t.diag("Trying to serialize various host objects (sometimes accesing their properties throws exceptions)")

    t.ok(Siesta.Util.Serializer.stringify(window), 'Serialized the `window` object')
    
    var div     = document.createElement('div')
    
    t.ok(Siesta.Util.Serializer.stringify(div), 'Serialized the div object')
    
    
    t.ok(Siesta.Util.Serializer.stringify(window.location), 'Serialized the `window.location` object')
    
    t.done()
})