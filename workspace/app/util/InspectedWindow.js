Ext.define('AI.util.InspectedWindow', {
    singleton : true,

    /**
     *
     * @param id
     */
    highlight : function(id) {
        Ext.getCmp(id).el.frame('red');
    },

    /**
     *
     * @param closure {Function}
     * @param argString {String}
     * @param callback {Function} A callback function passed two parameters:
     *     - result {any}: Whatever the closure function returns
     *     - isException {Boolean}: whether-or-not the closure function encountered an exception
     */
    eval : function(closure, argString, callback) {
        var callbackFn = callback,
            args = '';

        if (argString) {
            args = '"' + argString + '"';
        }

        chrome.devtools.inspectedWindow.eval(
            '(' + closure + ')(' + args + ')',
            function (result, isException) {
                if (isException) {
                    AI.util.parseException(isException);
                    return;
                }

                callbackFn(result, isException);
            }
        );
    }
});