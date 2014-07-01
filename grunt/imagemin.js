'use strict';

/**
 * Minify PNG, JPEG and GIF images.
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-contrib-imagemin
 */
module.exports = {
    resources: {
        files: [
            {
                expand: true,
                cwd   : '<%= app %>/images',
                src   : '{,*/}*.{png,jpg,jpeg}',
                dest  : '<%= dist %>/images'
            }
        ]
    },
    sencha   : {
        files: [
            {
                expand: true,
                cwd   : '<%= ai %>/build/production/AI/resources/images',
                src   : '{,*/}*.{png,jpg,jpeg}',
                dest  : '<%= dist %>/AppInspector/resources/images'
            }
        ]
    }
};
