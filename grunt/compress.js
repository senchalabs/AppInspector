'use strict';

/**
 * Compress files and folders.
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-contrib-compress
 */
module.exports = {
    dist: {
        options: {
            archive: 'package/AppInspector.zip'
        },
        files  : [
            {
                expand: true,
                cwd   : 'dist/',
                src   : ['**'],
                dest  : ''
            }
        ]
    }
};
