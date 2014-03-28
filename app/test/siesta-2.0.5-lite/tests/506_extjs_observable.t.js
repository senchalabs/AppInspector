StartTest(function(t) {
    t.diag('Observable');
    
//    firesOk: function (observable, event, n, timeOut, func, desc, callback) {
//    },
//        
//        
//    willFireNTimes: function (observable, event, n, desc, isGreaterEqual) {
//    },

//    wontFire : function(observable, event, desc) {

//    firesAtLeastNTimes : function(observable, event, n, desc) {

    var observable      = new Ext.Panel({
        listeners       : {
            render  : function () {}
        }
    })


    t.expectPass(function (t) {
        t.hasListener(observable, 'render', "Has listener")
    });
    
    
    t.expectFail(function (t) {
        t.hasListener(observable, 'afterlayout', "Has listener")
    });
    
});