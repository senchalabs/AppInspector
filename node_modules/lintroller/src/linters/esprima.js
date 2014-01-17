"use strict";
var ESPRIMA = require('esprima');

/**
 * @class LintRoller.linters.Esprima
 *
 * Created automatically if a { type : 'esprima' } config is passed to the linters array.
 */
var linter = {

    lib : ESPRIMA,

    /**
     * @cfg {Object}
     * An object containing lint validation options
     */
    options : {
        tolerant : true
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
                this.options[i] = options[i];
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

        parentModule.log('Running Esprima against code...', false);

        parentModule.async.each(
            parentModule.files,

            function (file, next) {
                /*
                 * JSHint cannot handle HTML fragments
                 * https://github.com/jshint/jshint/issues/215
                 */
                if (!fileMatch.test(file)) {
                    parentModule.log('Esprima cannot handle HTML input. File: ' + file, false);
                }
                else {
                    js = parentModule.fs.readFileSync(file, 'utf8');
                    lineCount += js.toString().split('\n').length;

                    var i = 0,
                        result, totalErrors, error;

                    try {
                        result = ESPRIMA.parse(js, me.options);

                        if (result.errors) {
                            totalErrors = result.errors.length;

                            for (i; i < totalErrors; i++) {
                                error = result.errors[i];

                                if (error) {
                                    errorList.push({
                                        file      : file,
                                        line      : error.lineNumber,
                                        character : error.column,
                                        reason    : error.message
                                    });

                                    if (parentModule.stopOnFirstError) {
                                        next(true);
                                    }
                                }
                            }
                        }
                    }
                    catch (caughtError) {
                        errorList.push({
                            file      : file,
                            line      : caughtError.lineNumber,
                            character : caughtError.column,
                            reason    : caughtError.message
                        });

                        if (parentModule.stopOnFirstError) {
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