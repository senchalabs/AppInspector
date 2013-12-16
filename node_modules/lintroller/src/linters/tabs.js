"use strict";

/**
 * @class LintRoller.linters.Tabs
 *
 * A utility for replacing all tabs found in your source files with spaces.
 *
 * Created automatically if a { type : 'tabs' } config is passed to the linters array.
 */
var linter = {

    /**
     * @cfg {Object}
     * An object containing lint validation options
     */
    options : {
        spaces : 4
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
        var i = 0,
            spaces = '',
            js;

        for (i; i < this.options.spaces; i++) {
            spaces += ' ';
        }

        parentModule.log('Replaces tabs with spaces...', false);

        parentModule.async.each(
            parentModule.files,

            function (file, next) {
                js = parentModule.fs.readFileSync(file, 'utf8');
                js = js.replace(/\t/g, spaces);

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