'use strict';

/**
 * Clean files and folders.
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-contrib-clean
 */
module.exports = {
    dist : {
        files : [
            {
                dot : true,
                src : [
                    '.tmp',
                    // 'package/*',
                    '<%= yeoman.dist %>/*',
                    '!<%= yeoman.dist %>/.git*'
                ]
            }
        ]
    },
    docs : {
        files : [
            {
                dot : true,
                src : [
                    'docs/*',
                    '!docs/.gitkeep'
                ]
            }
        ]
    }
};
