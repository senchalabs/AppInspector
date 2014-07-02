'use strict';

/**
 * Compile JSDuck documentation.
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-jsduck
 */
module.exports = {
    main: {
        // source paths with your code
        src    : [
            //'<%= ai %>/ext/src',
            '<%= ai %>/app'
        ],

        // docs output dir
        dest   : 'docs',

        // extra options
        options: {
            'title'   : 'App Inspector for Sencha',
            'warnings': ['-all']
        }
    }
};
