"use strict";
var JSLINT = require('jslint')();

/**
 * @class LintRoller.linters.JSLint
 *
 * Created automatically if a { type : 'jsLint' } config is passed to the linters array.
 */
var linter = {

    /**
     * @property
     * JSLint
     */
    lib : JSLINT,

    /**
     * @cfg {Object}
     * An object containing lint validation options
     */
    options : {
        nomen     : true, //if names may have dangling _
        plusplus  : true, //if increment/decrement should be allowed
        sloppy    : true, //if the 'use strict'; pragma is optional
        vars      : true, //if multiple var statements per function should be allowed
        white     : true, //if sloppy whitespace is tolerated
        undef     : true, //if variables can be declared out of order,
        node      : true, //if Node.js globals should be predefined
        browser   : true, //if the standard browser globals should be predefined
        stupid    : true, //if really stupid practices are tolerated... namely blocking synchronous operations
        fragement : true //if HTML fragments should be allowed
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
            lineCount = 0,
            js;

        parentModule.log('Running JSLint against code...', false);

        parentModule.async.each(
            parentModule.files,

            function (file, next) {
                js = parentModule.fs.readFileSync(file, 'utf8');
                lineCount += js.toString().split('\n').length;

                var i = 0,
                    result = me.lib(js, me.options),
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