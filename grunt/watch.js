'use strict';

var chalk = require('chalk');

/**
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-contrib-watch
 */
module.exports = function (grunt) {
    return {
        options : {
            dateFormat : function (runtime) {
                var now = new Date(),
                    date = now.toLocaleDateString(),
                    time = now.toLocaleTimeString();

                grunt.log.writeln('');
                grunt.log.writeln(chalk.bold.green('✔ done.'));
                grunt.log.writeln('');
                grunt.log.writeln([
                    'Watch finished in',
                    chalk.blue(runtime + 'ms'),
                    chalk.gray('(' + date + ' ' + time + ')') + '.'
                ].join(' '));
                grunt.log.writeln('Waiting for more changes...');
                grunt.log.writeln('');
            },
        },
        develop : {
            files   : [
                'app/AppInspector/app/util/**/*',
                'app/AppInspector/app/**/override/*',
                'app/AppInspector/metadata/**/*',
                'app/background.js',
                'app/devtools-page.js'
            ],
            tasks   : ['dev'],
            options : {
                spawn : false,
            }
        }
    };
};
