/**
 * @class   AI.util.Error
 * @singleton
 */
Ext.define('AI.util.Error', {
    singleton : true,

    /**
     * @param {Object} exception
     */
    parseException : function (exception) {
        var msg = '';
        for (var key in exception) {
            if (exception.hasOwnProperty(key)) {
                msg += key + ': ' + exception[key] + '\n';
            }
        }

        Ext.Msg.alert('isException', msg);
    }
});
