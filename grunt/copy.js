'use strict';

/**
 * Copy files and folders.
 * Put files not handled in other tasks here
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-contrib-copy
 */
module.exports = {
    dist: {
        files: [
            {
                expand: true,
                cwd   : '<%= app %>',
                dest  : '<%= dist %>',
                src   : [
                    '*.{html,js}',
                    '_locales/**/*'
                ]
            },
            {
                expand: true,
                cwd   : '<%= app %>/..',
                dest  : '<%= dist %>',
                src   : 'LICENSE'
            },
            {
                expand: true,
                cwd   : '<%= app %>/background',
                dest  : '<%= dist %>/background',
                src   : '*.{html,js}'
            },
            {
                expand: true,
                cwd   : '<%= app %>/devtools',
                dest  : '<%= dist %>/devtools',
                src   : '*.{html,js}'
            },
            {
                expand: true,
                cwd   : '<%= ai %>/build/production/AI',
                dest  : '<%= dist %>/AppInspector',
                src   : '**/*'
            }
        ]
    }
};
