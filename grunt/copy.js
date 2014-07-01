'use strict';

var _ = require('lodash'),
    common = [
        {
            expand: true,
            cwd   : '<%= app %>',
            dest  : '<%= dist %>',
            src   : [
                '*.{html,js}', '_locales/**/*'
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
            src   : [
                '*.{html,js}'
            ]
        },
        {
            expand: true,
            cwd   : '<%= app %>/devtools',
            dest  : '<%= dist %>/devtools',
            src   : [
                '*.{html,js}'
            ]
        }
    ],
    dist = [
        {
            expand: true,
            cwd   : '<%= ai %>/build/production/AI',
            dest  : '<%= dist %>/AppInspector',
            src   : [
                '*.{html,js}',
                'resources/*.css'
            ]
        }
    ],
    dev = [
        {
            expand: true,
            cwd   : '<%= ai %>',
            dest  : '<%= dist %>/AppInspector',
            src   : 'mocks.js'
        },
        {
            expand: true,
            cwd   : '<%= ai %>/build/testing/AI',
            dest  : '<%= dist %>/AppInspector',
            src   : [
                '*.{html,js}',
                'resources/*.css'
            ]
        },
        // we copy images on dev build
        // on build|production this is done through 'imagemin'
        {
            expand: true,
            cwd   : '<%= app %>/images',
            dest  : '<%= dist %>/images',
            src   : '{,*/}*.{png,jpg,jpeg}'
        },
        {
            expand: true,
            cwd   : '<%= ai %>/build/testing/AI/resources/images',
            dest  : '<%= dist %>/AppInspector/resources/images',
            src   : '{,*/}*.{png,jpg,jpeg}'
        }
    ];

/**
 * Copy files and folders.
 * Put files not handled in other tasks here
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-contrib-copy
 */
module.exports = {
    dist: {
        files: _.union(common, dist)
    },
    dev : {
        files: _.union(common, dev)
    }
};
