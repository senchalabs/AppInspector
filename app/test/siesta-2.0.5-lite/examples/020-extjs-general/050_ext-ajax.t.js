StartTest(function(t) {
    
    Ext.Ajax.request({
        url : '050_ext-ajax.t.js'   // Just grab some file
    });

    // Waits until Ext.data.Connection.isLoading returns false
    t.waitForAjaxRequest(function() {
        t.pass('Nice');
    });

    var req = Ext.Ajax.request({
        url : 'index.js'   // Just grab some file
    });

    // Or wait for a specific request
    t.waitForAjaxRequest(req, function(requestObj) {
        t.is(requestObj.options.url, 'index.js', 'Grabbed index.js');
    });

    t.ajaxRequestAndThen('index.html', function(options, success, response) {
        t.ok(response.responseText.match('siesta-all.js'), 'Found siesta-all.js in the index.html, seems reasonable.');
    });
});