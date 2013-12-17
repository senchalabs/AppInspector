/**
 *
 */
Ext.define('AI.util.InspectedWindow', {
    singleton : true,

    requires : [
        'AI.util.Error'
    ],

    /**
     * @param {String} id
     */
    highlight : function (id) {
        var cmp = Ext.getCmp(id);

        if (cmp && cmp.rendered) {
            cmp.el.frame('red', 3, { duration : 250 });
        }
    },

    /**
     * @param {Function} closure
     * @param {String} argString
     * @param {Function} callback  A callback function passed two parameters:
     *
     * - result {*}: Whatever the closure function returns
     *
     * - isException {Boolean}: whether-or-not the closure function encountered an exception
     */
    eval : function (closure, argString, callback) {
        var callbackFn = callback,
            args = '';

        if (argString) {
            args = '"' + argString + '"';
        }

        chrome.devtools.inspectedWindow.eval(
            '(' + closure + ')(' + args + ')',
            function (result, isException) {
                if (isException) {
                    AI.util.Error.parseException(isException);
                    return;
                }

                callbackFn(result, isException);
            }
        );
    }
});