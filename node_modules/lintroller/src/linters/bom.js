"use strict";

/**
 * @class LintRoller.linters.BOM
 *
 * A utility that will remove all Byte-Order-Marks (BOM - \uFEFF) from a file
 *
 * Created automatically if a { type : 'bom' } config is passed to the linters array.
 */
var linter = {

    /**
     * @cfg {Object}
     * An object containing lint validation options
     */
    options : {

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
        var js;

        parentModule.log('Replaces tabs with spaces...', false);

        parentModule.async.each(
            parentModule.files,

            function (file, next) {
                js = parentModule.fs.readFileSync(file, 'utf8');
                js = js.replace(/\uFEFF/g, '');

                parentModule.fs.writeFileSync(file, js, 'utf8');

                next(null);
            },

            function () {
                callback();
            }
        );

    }

};

module.exports = linter;