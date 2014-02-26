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
        files: [{
            expand: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
                '*.{html,js}', '_locales/**/*'
            ]
        }, {
            expand: true,
            cwd: '<%= yeoman.app %>/AppInspector/build/production/AI',
            dest: '<%= yeoman.dist %>/AppInspector',
            src: [
                '*.{html,js}',
                'resources/*.css'
            ]
        }]
    }
};
