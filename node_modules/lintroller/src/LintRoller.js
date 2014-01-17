/*
 Copyright (c) 2011 Arthur Kay

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is furnished
 to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @class LintRoller
 * @author Arthur Kay (http://www.akawebdesign.com)
 * @singleton
 * @version 2.3.5
 *
 * GitHub Pages: [http://arthurakay.github.io/LintRoller/](http://arthurakay.github.io/LintRoller/)
 *
 * GitHub Repo: [https://github.com/arthurakay/LintRoller](https://github.com/arthurakay/LintRoller)
 */
"use strict";

var version = '2.3.5';

var LintRoller = {
    /**
     * @cfg {Array} filepaths
     * REQUIRED. An array of relative filepaths to the folders containing JS files
     */

    /**
     * @cfg {Array} exclusions
     * REQUIRED. An array of relative filepaths to the folders containing JS files that should NOT be linted
     */

    /**
     * @cfg {Boolean}
     * True to log errors directly into stdout
     */
    stdoutErrors : false,

    /**
     * @cfg {Boolean}
     * True to show verbose ouput in the terminal.
     */
    verbose : true,

    /**
     * @cfg {RegularExpression}
     * Regular Expression for matching files to lint
     */
    regex : /\.(js|html)$/i,

    /**
     * @cfg {String}
     * Output message when no lint errors are found
     */
    defaultSuccessMessage : '\nSuccessfully linted your code!\n\n',

    /**
     * @cfg {Boolean}
     * True to stop linting your code when the first error is encountered.
     */
    stopOnFirstError : true,

    /**
     * @cfg {Array}
     * An array of lint module config objects. See the classes under LintRoller.linters for more information.
     */
    linters : [],

    /**
     * @cfg {Object/String}
     * An object containing:
     *
     *   - "name": the relative filepath to where error messages will be logged
     *   - "type": the type of output ("text" or "json")
     *
     *   Set to null to disable logging errors to a file.
     *
     *   You can optionally just provide a string as the filepath to a log file - the "type" will simply default to "text".
     *
     *   For JSON output, errors returned in following format:
     *
     *       errorList = {
     *           totalErrors : 1,
     *           totalFiles  : 1,
     *
     *           lineCounts : {
     *               jslint : 35
     *           },
     *
     *           //one array per configured linter
     *           jslint : [
     *               {
     *                   file      : 'file.js',
     *                   line      : 0,
     *                   character : 0,
     *                   reason    : 'Just because!'
     *               }
     *           ]
     *       }
     */
    logFile : {
        name : 'error_log.txt',
        type : 'text'
    },

    /**
     * Call this method to de-lint your JavaScript codebase.
     *
     * See the examples for specific usage, but the basic idea:
     *
     *     var LintRoller = require('LintRoller');
     *
     *     var config = {
     *
     *         //recursively include JS files in these folders
     *         filepaths  : [
     *             './'
     *         ],
     *
     *         //but ignore anything in these folders
     *         exclusions : [
     *             './node_modules/',
     *          ],
     *
     *         linters : [
     *             { type : 'jsLint' }
     *         ]
     *     };
     *
     *     LintRoller.init(config);
     *
     */
    init : function (config) {
        this.log('*** LintRoller v' + this.getVersion() + ' ***\n', true);

        //APPLY CONFIG OPTIONS
        this.initConfigs(config);

        this.parseTree(config.filepaths);
        this.log('\nFilesystem has been parsed. Looping through available files...');

        this.clearLogFile();
        this.lintFiles();
    },

    /**
     * @private
     */
    files : [],

    /**
     * @method
     *
     * Returns the current version number.
     */
    getVersion : function () {
        return version;
    },

    /**
     * @private
     */
    initConfigs : function (config) {
        var i,
            logFile;

        if (!config) {
            return false;
        }

        for (i in config) {
            if (config.hasOwnProperty(i)) {
                if (i === 'linters') {
                    this.setLinters(config[i]);
                }
                else if (i === 'logFile') {
                    logFile = config[i];

                    if (logFile === null) {
                        delete this.logFile;
                    }
                    else {
                        if (typeof logFile === 'string') {
                            this.logFile.name = logFile;
                            //type will remain "text" by default
                        }
                        else {
                            //TODO: hard-coding object assignment this for now... may revisit later
                            this.logFile.name = logFile.name;
                            this.logFile.type = logFile.type;
                        }
                    }
                }
                else {
                    this[i] = config[i];
                }
            }
        }
    },

    /**
     * @private
     */
    setLinters : function (linters) {
        if (!(linters instanceof Array) || linters.length === 0) {
            process.exit(1);
        }

        var i = 0,
            linter, linterCfg;

        for (i; i < linters.length; i++) {
            linterCfg = linters[i];

            this.log('Initializing linter: ' + linterCfg.type, true);

            linter = require('./linters/' + linterCfg.type.toLowerCase());
            linter.applyLintOptions(linterCfg.options);
            linter.name = linterCfg.type.toLowerCase();

            this.linters.push(linter);
        }
    },

    /**
     * @private
     */
    announceErrors : function (errorList) {
        this.log('\nFix Your Errors!', true);

        if (this.logFile && (typeof this.logFile.name === 'string')) {
            this.logToFile(errorList);
        }

        if (this.stdoutErrors === true) {
            this.logToStdOut(errorList);
        }

        process.exit(1);
    },

    /**
     * @private
     */
    announceSuccess : function () {
        this.log(this.defaultSuccessMessage, true);
        process.exit(0);
    },

    /**
     * @private
     */
    getFiles : function (path) {
        var tree = this.fs.readdirSync(path);

        this.log('\nFILES FOUND AT PATH: ' + path);
        this.log(tree);

        return tree;
    },

    /**
     * @private
     */
    parseTree : function (pathConfig) {
        var i = 0,
            path = [];

        if (typeof pathConfig === 'string') {
            path.push(pathConfig);
        }
        else {
            path = pathConfig; //should be an array of strings
        }

        var currPath, exclude, j,
            list, x;

        for (i; i < path.length; i++) {
            currPath = path[i];
            exclude = false;

            this.log('\n*** currPath: ' + currPath);

            if (this.exclusions) {
                this.log('Checking exclusion paths...');

                for (j = 0; j < this.exclusions.length; j++) {
                    if (currPath === this.exclusions[j]) {
                        exclude = true;
                    }
                }
            }

            if (exclude) {
                this.log('Excluding path: ' + currPath);
            }
            else {
                //if the path is a file, skip to the actual linting...

                if (this.regex.test(currPath)) {
                    this.log(currPath + ' is a single file. Running parseFile()...');
                    this.parseFile('', currPath);
                }
                else {
                    this.log(currPath + ' is a directory. Running parseFile() on all contained files...');

                    list = this.getFiles(currPath);

                    for (x = 0; x < list.length; x++) {
                        this.parseFile(currPath, list[x]);
                    }
                }
            }
        }
    },

    /**
     * @private
     */
    parseFile : function (currPath, fileName) {
        var spacer = '    ',
            childPath;

        var stats = this.fs.statSync(currPath + fileName);

        if (stats.isFile()) {
            this.log(spacer + fileName + ' IS A FILE');
            /*
             * We only want files matching our regex
             */
            if (this.regex.test(fileName)) {
                this.files.push(currPath + fileName);
                this.log(spacer + 'Added to the list.');
            }
            else {
                this.log(spacer + fileName + ' IS NOT A MATCHING FILE');
            }
        }
        else {
            this.log(spacer + fileName + ' IS NOT A FILE');

            /*
             * If not a file
             *   - check against parent paths
             *   - recurse into child paths
             */
            if (fileName === '.' || fileName === '..') {
                this.log(spacer + fileName + ' IS A RELATIVE DIRECTORY PATH');
            }
            else {
                childPath = currPath + fileName + '/';
                this.parseTree(childPath);
            }
        }
    },

    /**
     * @private
     */
    lintFiles : function () {
        var me = this,
            errorList = {
                totalFiles : this.files.length,

                lineCounts : {}
            },
            errors = 0;

        this.log('\n' + errorList.totalFiles + ' matching files found.', true);

        /*
         * Loop through all files with each linter
         */
        this.async.each(
            this.linters,

            function (linter, callback) {
                linter.runLinter(
                    me,
                    function (newErrors, lineCount) {
                        if (newErrors) {
                            errors += newErrors.length;
                            errorList[linter.name] = newErrors;
                        }

                        if (lineCount) {
                            errorList.lineCounts[linter.name] = lineCount;
                        }

                        callback(null);
                    }
                );
            },

            /*
             * When all linting is complete...
             */
            function () {
                errorList.totalErrors = errors;

                if (errors > 0) {
                    me.announceErrors(errorList);
                }
                else {
                    me.announceSuccess();
                }
            }
        );
    },

    /**
     * @private
     */
    generateLogTitle : function(errorList) {
        var output, key,
            lineCounts = errorList.lineCounts;

        output = [
            'LintRoller v' + this.getVersion() + '\n',
            '    Output for ' + new Date() + '\n',
            '    Total files found   : ' + errorList.totalFiles,
            '    All errors reported : ' + errorList.totalErrors,
            '\n'
        ];

        for (key in lineCounts) {
            if (lineCounts.hasOwnProperty(key)) {
                output.push('    ' + lineCounts[key] + ' lines checked via ' + key.toUpperCase());
            }
        }

        output.push('\n');

        return output.join('\n');
    },

    /**
     * @private
     */
    generateTextHeader : function(linter, lintErrors) {
        return [
            '=============== ',
            'Running ' + linter.toUpperCase(),
            ' [ Total errors: ' + lintErrors.length + ' ] ',
            '===============',
            '\n\n'
        ].join('');
    },

    /**
     * @private
     */
    logToStdOut : function (errorList) {
        this.log(this.formatTextOutput(errorList), true);
    },

    /**
     * @private
     */
    logToFile : function (errorList) {
        this.log('\nWriting ' + errorList.totalErrors + ' errors to new log file.', true);

        var output;

        switch (this.logFile.type.toUpperCase()) {
            case 'JSON':
                output = JSON.stringify(errorList);
                break;

            case 'XML':
                this.log('\nNot currently supporting XML output...');
                return;

            default:
                output = this.formatTextOutput(errorList);
                break;
        }

        try {
            this.fs.writeFileSync(this.logFile.name, output);
        }
        catch (err) {
            this.log('\nAn error occurred while trying to generate new log file.', true);
        }
    },

    formatTextOutput : function (errorList) {
        var output = this.generateLogTitle(errorList),
            lintErrors,
            i, x, error;

        for (i in errorList) {
            if (errorList.hasOwnProperty(i)) {
                lintErrors = errorList[i];

                switch (i) {
                    case 'jslint':
                    case 'jshint':
                    case 'esprima':
                        output += this.generateTextHeader(i, lintErrors);

                        for (x = 0; x < lintErrors.length; x++) {
                            error = lintErrors[x];
                            output += error.file + '\n' +
                                      '    Line #: ' + error.line + '\n' +
                                      '    Char #: ' + error.character + '\n' +
                                      '    Reason: ' + error.reason + '\n\n';
                        }
                        break;

                    case 'w3c_html':
                        output += this.generateTextHeader(i, lintErrors);

                        for (x = 0; x < lintErrors.length; x++) {
                            error = lintErrors[x];
                            output += error.file + '\n' +
                                      '    Line #: ' + error.line + '\n' +
                                      '    Char #: ' + error.character + '\n' +
                                      '    Message: ' + error.reason + '\n\n';
                        }
                        break;

                    default:
                        break;
                }
            }
        }

        return output;
    },

    clearLogFile : function () {
        if (!this.logFile) {
            return;
        }

        try {
            this.log('\nDeleting old log file...', true);
            this.fs.unlinkSync(this.logFile.name);
            this.log('Done.', true);
        }
        catch (err) {
            this.log('No log file currently exists.', true);
        }
    },

    /**
     * @private
     */
    log : function (msg, override) {
        if (this.verbose || override) {
            console.log(msg);
        }
    }

};

var initModules = function (me) {
    //filesystem API
    me.fs = require('fs');

    //async lib
    me.async = require('async');
};

initModules(LintRoller);

module.exports = LintRoller;