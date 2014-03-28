'use strict';

/**
 * Minify PNG, JPEG and GIF images.
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-contrib-imagemin
 */
module.exports = {
    resources: {
        files: [{
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= yeoman.dist %>/images'
        }]
    },
    sencha: {
        files: [{
            expand: true,
            cwd: '<%= yeoman.app %>/AppInspector/build/production/AI/resources/images',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= yeoman.dist %>/AppInspector/resources/images'
        }]
    }
};
