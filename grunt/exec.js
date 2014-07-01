'use strict';

var chalk = require('chalk'),
    lookup = './app/AppInspector/.sencha/';

/**
 * Grunt task for executing shell commands.
 * @param  {Object} grunt
 * @return {Object}
 *
 * @see https://www.npmjs.org/package/grunt-exec
 */
module.exports = function (grunt) {
    // Look up if »./app/AppInspector/.sencha/« exist containing build property files.

    // If not, fail task!
    if (!grunt.file.isDir(lookup)) {
        grunt.fail.fatal([
            chalk.bold.blue(lookup) + chalk.white(' folder not found!'),
            'Can\'t run build!'
        ].join(grunt.util.linefeed));
    }

    // return task config
    return {
        dev       : {
            cwd    : '<%= ai %>/',
            command: 'sencha -q -pl -n app build -e testing -c'
        },
        production: {
            cwd    : '<%= ai %>/',
            command: 'sencha -q -pl -n app build -e production'
        }
    };
};
