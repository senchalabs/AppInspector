'use strict';

/**
 * Clean files and folders.
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-contrib-clean
 */
module.exports = {
    dist: {
        files: [{
            dot: true,
            src: [
                '.tmp',
                '<%= yeoman.dist %>/*',
                '!<%= yeoman.dist %>/.git*',
                // 'package/*'
            ]
        }]
    },
    docs: {
        files: [{
            dot: true,
            src: [
                'docs/*',
                '!docs/.gitkeep'
            ]
        }]
    }
};
