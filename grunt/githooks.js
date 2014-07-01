'use strict';

/**
 * A Grunt plugin to help bind Grunt tasks to Git hooks.
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-githooks
 *
 * NOTE: run the »githooks« task only once or when adding new hooks
 */
module.exports = {
    all: {
        'pre-commit': 'jshint'
    }
};
