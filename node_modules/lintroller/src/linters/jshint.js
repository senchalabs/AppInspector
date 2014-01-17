"use strict";
var JSHINT = require('jshint').JSHINT;

/**
 * @class LintRoller.linters.JSHint
 *
 * Created automatically if a { type : 'jsHint' } config is passed to the linters array.
 */
var linter = {

    /**
     * @property
     * JSHint
     */
    lib : JSHINT,

    /**
     * @cfg {Object}
     * An object containing lint validation options
     */
    options : {

    },

    /**
     * @cfg {Object}
     * An object containing the pre-defined globals of the lint validation options
     */
    globals : {

    },

    /**
     * @private
     */
    applyLintOptions : function (options) {
        var i;

        if (!options) {
            return false;
        }

        for (i in options) {
            if (options.hasOwnProperty(i)) {
                if (i === 'globals') {
                    this.globals = options[i];
                }
                else {
                    this.options[i] = options[i];
                }
            }
        }
    },

    /**
     * @private
     */
    runLinter : function (parentModule, callback) {
        var me = this,
            errorList = [],
            fileMatch = /\.js$/i,
            lineCount = 0,
            js;

        parentModule.log('Running JSHint against code...', false);

        parentModule.async.each(
            parentModule.files,

            function (file, next) {
                /*
                 * JSHint cannot handle HTML fragments
                 * https://github.com/jshint/jshint/issues/215
                 */
                if (!fileMatch.test(file)) {
                    parentModule.log('JSHint cannot handle HTML input. File: ' + file, false);
                }
                else {
                    js = parentModule.fs.readFileSync(file, 'utf8');
                    lineCount += js.toString().split('\n').length;

                    var i = 0,
                        result = me.lib(js, me.options, me.globals),
                        totalErrors = me.lib.errors.length,
                        error;

                    if (!result) {
                        for (i; i < totalErrors; i++) {
                            error = me.lib.errors[i];

                            if (error) {
                                errorList.push({
                                    file      : file,
                                    line      : error.line,
                                    character : error.character,
                                    reason    : error.reason
                                });

                                if (parentModule.stopOnFirstError) {
                                    break;
                                }
                            }
                        }

                        if (parentModule.stopOnFirstError && errorList.length > 0) {
                            next(true);
                        }
                    }
                }

                next(null);
            },

            function (e) {
                if (e && parentModule.stopOnFirstError && errorList.length > 0) {
                    parentModule.announceErrors(errorList);
                }

                callback(errorList, lineCount);
            }
        );
    }

};

module.exports = linter;