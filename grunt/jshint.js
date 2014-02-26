'use strict';

/**
 * Validate files with JSHint.
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-contrib-jshint
 */
module.exports = {
    options: {
        jshintrc: '.jshintrc',  // see http://www.jshint.com/docs/
        reporter: require('jshint-stylish')
    },
    // lint task files
    grunt: [
        'Gruntfile.js',
        'grunt/**/*.js'
    ],
    // lint app files
    app: [
        '<%= yeoman.app %>/AppInspector/app.js',
        '<%= yeoman.app %>/AppInspector/app/**/*.js'
    ]
};
