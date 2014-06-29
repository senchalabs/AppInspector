/**
 * @class   AI.util.Error
 * @singleton
 */
Ext.define('AI.util.Error', {
    singleton: true,

    requires: [
        'Ext.MessageBox'
    ],

    /**
     * @param {Object} exception
     */
    parseException: function(exception) {
        var msg = '';

        for (var key in exception) {
            if (exception.hasOwnProperty(key)) {
                msg += key + ': ' + exception[key] + '\n';
            }
        }

        // <debug>
        console.debug(msg, exception);
        // </debug>

        Ext.MessageBox.alert('isException', msg);
    }
});
