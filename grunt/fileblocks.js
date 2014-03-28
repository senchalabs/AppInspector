'use strict';

/**
 * A Grunt task that prepares an HTML, JavaScript or Typescript file
 * by inserting or removing tags into marked blocks for each file that matches a source pattern.
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-file-blocks
 * @see https://github.com/rrharvey/grunt-file-blocks
 */
module.exports = {
    options    : {
        removeAnchors : true,
        cwd           : 'app/AppInspector',
        template      : '<script src="${file}"></script>'
    },
    dist       : {
        src    : 'tpl/index-dist.html.tpl',
        dest   : 'dist/AppInspector/index.html',
        blocks : {
            'mocks' : {
                src : 'mocks.js'
            }
        }
    }
};
