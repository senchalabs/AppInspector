'use strict';

var chalk = require('chalk');

/**
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-contrib-watch
 */
module.exports = function(grunt) {
    return {
        options: {
            dateFormat: function(time) {
                grunt.log.writeln('');
                grunt.log.writeln(chalk.bold.green('✔ done.'));
                grunt.log.writeln(
                    'Watch finished in ' + chalk.green(time) + 'ms at ' + chalk.gray(new Date()).toString()
                );
                grunt.log.writeln('Waiting for more changes...');
                grunt.log.writeln('');
            },
        },
        develop: {
            files: [
                'app/AppInspector/app/util/**/*',
                'app/AppInspector/metadata/**/*',
                'app/background.js',
                'app/devtools-page.js'
            ],
            tasks: ['dev'],
            options: {
                spawn: false,
            }
        }
    };
};
