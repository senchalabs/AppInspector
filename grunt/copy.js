'use strict';

var _ = require('lodash'),
    common = [
        {
            expand : true,
            cwd    : '<%= yeoman.app %>',
            dest   : '<%= yeoman.dist %>',
            src    : [
                '*.{html,js}', '_locales/**/*'
            ]
        },
        {
            expand : true,
            cwd    : '<%= yeoman.app %>/..',
            dest   : '<%= yeoman.dist %>',
            src    : 'LICENSE'
        },
        {
            expand : true,
            cwd    : '<%= yeoman.app %>/background',
            dest   : '<%= yeoman.dist %>/background',
            src    : [
                '*.{html,js}'
            ]
        },
        {
            expand : true,
            cwd    : '<%= yeoman.app %>/devtools',
            dest   : '<%= yeoman.dist %>/devtools',
            src    : [
                '*.{html,js}'
            ]
        }
    ],
    dist = [
        {
            expand : true,
            cwd    : '<%= yeoman.app %>/AppInspector/build/production/AI',
            dest   : '<%= yeoman.dist %>/AppInspector',
            src    : [
                '*.{html,js}',
                'resources/*.css'
            ]
        }
    ],
    dev = [
        {
            expand : true,
            cwd    : '<%= yeoman.app %>/AppInspector',
            dest   : '<%= yeoman.dist %>/AppInspector',
            src    : 'mocks.js'
        },
        {
            expand : true,
            cwd    : '<%= yeoman.app %>/AppInspector/build/testing/AI',
            dest   : '<%= yeoman.dist %>/AppInspector',
            src    : [
                '*.{html,js}',
                'resources/*.css'
            ]
        },
        // we copy images on dev build
        // on build|production this is done through 'imagemin'
        {
            expand : true,
            cwd    : '<%= yeoman.app %>/images',
            dest   : '<%= yeoman.dist %>/images',
            src    : '{,*/}*.{png,jpg,jpeg}'
        },
        {
            expand : true,
            cwd    : '<%= yeoman.app %>/AppInspector/build/testing/AI/resources/images',
            dest   : '<%= yeoman.dist %>/AppInspector/resources/images',
            src    : '{,*/}*.{png,jpg,jpeg}'
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
    dist : {
        files : _.union(common, dist)
    },
    dev  : {
        files : _.union(common, dev)
    }
};
